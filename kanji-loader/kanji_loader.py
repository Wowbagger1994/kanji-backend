from bs4 import BeautifulSoup
import pandas as pd
from sqlalchemy import create_engine
import ast
import os
from dotenv import load_dotenv
import numpy as np
import json

load_dotenv()


# Helper function to extract data from the XML structure
def extract_data(root):
    parsed_data = {
        "literal": None,
        "codepoint_ucs": None,
        "codepoint_jis208": None,
        "radical_classical": None,
        "radical_nelson_c": None,
        "grade": 0,
        "jlpt": 0,
        "stroke_count": 0,
        "dic_number_classical": None,
        "dic_number_nelson_c": None,
        "reading_ja_on": [],
        "reading_ja_kun": [],
        "meaning_en": [],
        "meaning_fr": [],
        "meaning_es": [],
        "meaning_pt": [],
        "nanori": []
    }
    # Extract <literal>
    parsed_data["literal"] = root.literal.text

    # Extract codepoint information
    for cp_value in root.codepoint.find_all("cp_value"):
        cp_type = cp_value["cp_type"]
        if cp_type == "ucs":
            parsed_data["codepoint_ucs"] = cp_value.text
            parsed_data["codepoint_ucs"] = parsed_data["codepoint_ucs"].lower()
            parsed_data["codepoint_ucs"] = parsed_data["codepoint_ucs"].strip()
            kanji_folder = "kanji"
            svg_file = os.path.join(kanji_folder, f'0{parsed_data["codepoint_ucs"]}.svg')
            parsed_data["svg_path"] = svg_file
        elif cp_type == "jis208":
            parsed_data["codepoint_jis208"] = cp_value.text

    # Extract radical information
    for rad_value in root.radical.find_all("rad_value"):
        rad_type = rad_value["rad_type"]
        if rad_type == "classical":
            parsed_data["radical_classical"] = rad_value.text
        elif rad_type == "nelson_c":
            parsed_data["radical_nelson_c"] = rad_value.text

    # Extract misc information (grade, stroke_count)
    if root.misc.grade:
        parsed_data["grade"] = int(root.misc.grade.text)
    if root.misc.stroke_count:
        parsed_data["stroke_count"] = int(root.misc.stroke_count.text)
    if root.misc.jlpt:
        parsed_data["jlpt"] = int(root.misc.jlpt.text)

    # Extract dictionary reference numbers
    if root.dic_number:
        for dic_ref in root.dic_number.find_all("dic_ref"):
            dr_type = dic_ref["dr_type"]
            if dr_type == "classical":
                parsed_data["dic_number_classical"] = dic_ref.text
            elif dr_type == "nelson_c":
                parsed_data["dic_number_nelson_c"] = dic_ref.text

    # Extract readings and meanings
    if root.reading_meaning and root.reading_meaning.rmgroup:
        rmgroup = root.reading_meaning.rmgroup
        for reading in rmgroup.find_all("reading"):
            r_type = reading["r_type"]
            if r_type == "ja_on":
                parsed_data["reading_ja_on"].append(reading.text)
            elif r_type == "ja_kun":
                parsed_data["reading_ja_kun"].append(reading.text)

        # Extract meanings based on language attribute or default
        for meaning in rmgroup.find_all("meaning"):
            attrbutes = meaning.get_attribute_list("m_lang")
            if attrbutes:
                m_lang = attrbutes[0]
            else:
                m_lang = ""
            if m_lang == "fr":
                parsed_data["meaning_fr"].append(meaning.text)
            elif m_lang == "es":
                parsed_data["meaning_es"].append(meaning.text)
            elif m_lang == "pt":
                parsed_data["meaning_pt"].append(meaning.text)
            else:
                parsed_data["meaning_en"].append(meaning.text)

    # Extract nanori readings
    if root.reading_meaning and root.reading_meaning.nanori:
        for nanori in root.reading_meaning.find_all("nanori"):
            parsed_data["nanori"].append(nanori.text)
    return parsed_data

# Function to convert list-like strings to actual lists
def convert_to_list(column):
    return column.apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

# Reading the data inside the xml file
with open('kanji-loader/kanjidic2.xml', 'r') as f:
    data = f.read()

# Passing the stored data inside the beautifulsoup parser, storing the returned object
Bs_data = BeautifulSoup(data, "xml")

# Extract data from XML
data = []
for root in Bs_data.find_all("character"):
    data.append(extract_data(root))

# Convert the list of dictionaries to a pandas DataFrame
df = pd.DataFrame(data)

# Filter out the rows with grade 0 or 8 and above
df = df[(df['grade'] > 0) & (df['grade'] < 8)]

df.reset_index(drop=True, inplace=True)
df['codepoint_ucs'] = df['codepoint_ucs'].str.lower()
df['codepoint_ucs'] = df['codepoint_ucs'].str.strip()

with open('kanji-loader/radical_kanji.txt', 'r') as f:
    radical_file = f.read()
# Split the data by lines and then by ';'
parsed_data = [line.strip().split(';') for line in radical_file.strip().splitlines()]

# Convert to DataFrame
df_radical = pd.DataFrame(parsed_data, columns=['Index', 'Codepoint1', 'Codepoint'])
df_radical.drop(columns=['Codepoint1'], inplace=True)

# Convert 'Codepoint2' to lowercase
df_radical['Codepoint'] = df_radical['Codepoint'].str.lower()
df_radical['Codepoint'] = df_radical['Codepoint'].str.strip()

# Merge the two DataFrames on 'codepoint_ucs' and 'Codepoint' and insert Index in dic_number_classical column
df = pd.merge(df, df_radical, left_on='codepoint_ucs', right_on='Codepoint', how='left')
df['dic_number_classical'] = df['Index']
df.drop(columns=['Index', 'Codepoint'], inplace=True)

list_columns = ['reading_ja_on', 'reading_ja_kun', 'meaning_en', 'meaning_fr', 'meaning_es', 'meaning_pt', 'nanori']
for col in list_columns:
    df[col] = convert_to_list(df[col])

# Create the connection to PostgreSQL
database_url = os.getenv("DATABASE_URL").split("?", 1)[0]
engine = create_engine(database_url)

# Specify the table name to load the data into
table_name = 'Kanji'

# Convert columns to appropriate data types
df['radical_classical'] = pd.to_numeric(df['radical_classical'], errors='coerce')
df['radical_nelson_c'] = pd.to_numeric(df['radical_nelson_c'], errors='coerce')
df['grade'] = pd.to_numeric(df['grade'], errors='coerce')
df['stroke_count'] = pd.to_numeric(df['stroke_count'], errors='coerce')
df['dic_number_classical'] = pd.to_numeric(df['dic_number_classical'], errors='coerce')
df['dic_number_nelson_c'] = pd.to_numeric(df['dic_number_nelson_c'], errors='coerce')

df = df.map(lambda x: int(x) if isinstance(x, float) and not np.isnan(x) else x)
df = df.replace({np.nan: None})

# Write the data to the database (creating the table if it doesn't exist)
df_dict = df[['literal', 'codepoint_ucs', 'codepoint_jis208', 'radical_classical',
    'radical_nelson_c', 'grade', 'stroke_count',
    'dic_number_classical', 'dic_number_nelson_c', 'reading_ja_on',
    'reading_ja_kun', 'meaning_en', 'meaning_fr', 'meaning_es',
    'meaning_pt', 'nanori']].to_dict(orient='records')

filename = 'data/kanji.json'
if os.path.exists(filename):
    os.remove(filename)
os.makedirs(os.path.dirname(filename), exist_ok=True)

with open(filename, 'w') as f:
    json.dump(df_dict, f, indent=4)

print(f"Dati caricati correttamente nella tabella '{table_name}'")


# Load Kanji Relationships

def extract_relationships():
    kanji_folder = "kanji-loader/kanji/"

    data = []

    for index, row in df.iterrows():
        codepoint_ucs = row['codepoint_ucs']
        svg_file = os.path.join(kanji_folder, f"0{codepoint_ucs}.svg")
        id = index + 1
        if os.path.isfile(svg_file):
            with open(svg_file, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'xml')

                g_elements = soup.find_all('g', limit=2)
                g_elements = g_elements[1].find_all('g', limit=2, recursive=False)
                if len(g_elements) >= 2:
                    kanji1_id = g_elements[0].get('kvg:element', "")
                    kanji1_attr = g_elements[0].get('kvg:radical', "")
                    if kanji1_attr == "":
                        kanji1_attr = "group"
                    kanji2_id = g_elements[1].get('kvg:element', "")
                    kanji2_attr = g_elements[1].get('kvg:radical', "")
                    if kanji2_attr == "":
                        kanji2_attr = "group"
                    if kanji1_id == '' or kanji2_id == '':
                        data.append({
                        "kanji_result_id": id,
                        "codepoint_ucs_res": codepoint_ucs
                    })
                    elif kanji2_attr == "group" or kanji1_attr == "tradit" or kanji1_attr == "general":
                        data.append({
                            "kanji_result_id": id,
                            "codepoint_ucs_res": codepoint_ucs,
                            "kanji1_id": kanji1_id,
                            "radical_type": kanji1_attr,
                            "kanji2_id": kanji2_id
                        })
                    elif kanji1_attr == "group" or kanji2_attr == "tradit" or kanji2_attr == "general":
                        data.append({
                            "kanji_result_id": id,
                            "codepoint_ucs_res": codepoint_ucs,
                            "kanji1_id": kanji2_id,
                            "radical_type": kanji2_attr,
                            "kanji2_id": kanji1_id
                        })
                    else:
                        data.append({
                            "kanji_result_id": id,
                            "codepoint_ucs_res": codepoint_ucs,
                            "kanji1_id": kanji1_id,
                            "radical_type": "no_radical_type",
                            "kanji2_id": kanji2_id
                        })
                elif len(g_elements) <= 1:
                    data.append({
                        "kanji_result_id": id,
                        "codepoint_ucs_res": codepoint_ucs
                    })
                data[-1]["relation_type"] = "literal"
    return pd.DataFrame(data)

kanji_rel_df = extract_relationships()
def format_dataframe(df_rel, df):
    for index, row in df_rel.iterrows():
        # Swap kanji1_id and kanji2_id if kanji1_id is greater than kanji2_id
        if not pd.isna(row['kanji1_id']) and not pd.isna(row['kanji2_id']):
            if row['kanji1_id'] > row['kanji2_id']:
                df_rel.at[index, 'kanji1_id'], df_rel.at[index, 'kanji2_id'] = row['kanji2_id'], row['kanji1_id']
                row['kanji1_id'], row['kanji2_id'] = row['kanji2_id'], row['kanji1_id']

        # If kanji1_id is NaN but kanji2_id is not, move kanji2_id to kanji1_id and set kanji2_id to NaN
        if pd.isna(row['kanji1_id']) and not pd.isna(row['kanji2_id']):
            df_rel.at[index, 'kanji1_id'] = row['kanji2_id']
            df_rel.at[index, 'kanji2_id'] = np.nan
            row['kanji1_id'] = row['kanji2_id']
            row['kanji2_id'] = np.nan

        # Update kanji1_id based on 'literal' from df
        if not pd.isna(df_rel.at[index, 'kanji1_id']):
            df_rel.at[index, 'kanji1_literal'] = df_rel.at[index, 'kanji1_id']
            matching_kanji1 = df[df['literal'] == row['kanji1_id']]
            df_rel.at[index, 'kanji1_id'] = matching_kanji1.index[0] + 1 if not matching_kanji1.empty else np.nan
        else:
            df_rel.at[index, 'kanji1_literal'] = np.nan

        # Update kanji2_id based on 'literal' from df
        if not pd.isna(df_rel.at[index, 'kanji2_id']):
            df_rel.at[index, 'kanji2_literal'] = df_rel.at[index, 'kanji2_id']
            matching_kanji2 = df[df['literal'] == row['kanji2_id']]
            df_rel.at[index, 'kanji2_id'] = matching_kanji2.index[0] + 1 if not matching_kanji2.empty else np.nan
        else:
            df_rel.at[index, 'kanji2_literal'] = np.nan
    df_rel = df_rel.map(lambda x: int(x) if isinstance(x, np.integer) else x)
    return df_rel


table_name = 'KanjiRelationships'
kanji_rel_df = format_dataframe(kanji_rel_df, df)
kanji_rel_df = kanji_rel_df.map(lambda x: int(x) if isinstance(x, float) and not np.isnan(x) else x)
kanji_rel_df = kanji_rel_df.replace({np.nan: None})
kanji_rel_df_dict = kanji_rel_df.to_dict(orient='records')

filename = 'data/kanji_relationships.json'
if os.path.exists(filename):
    os.remove(filename)
with open(filename, 'w') as f:
    json.dump(kanji_rel_df_dict, f, indent=4)
