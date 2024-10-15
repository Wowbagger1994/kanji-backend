from bs4 import BeautifulSoup
import pprint
import pandas as pd
from sqlalchemy import create_engine
import ast
import os
from dotenv import load_dotenv

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
pprint.pp(data[:2])

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

# Write the data to the database (creating the table if it doesn't exist)
df[['literal', 'codepoint_ucs', 'codepoint_jis208', 'radical_classical',
    'radical_nelson_c', 'grade', 'stroke_count',
    'dic_number_classical', 'dic_number_nelson_c', 'reading_ja_on',
    'reading_ja_kun', 'meaning_en', 'meaning_fr', 'meaning_es',
    'meaning_pt', 'nanori']].to_sql(table_name, engine, if_exists='append', index=False)

print(f"Dati caricati correttamente nella tabella '{table_name}'")
