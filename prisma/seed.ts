import { PrismaClient, RadicalType, RelationType } from '@prisma/client';
import * as data from '../data/kanji.json';
import * as dataRelations from '../data/kanji_relationships.json';
import { userConstants } from '../src/users/constants';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    '123456Eb',
    userConstants.roundsOfHashing,
  );
  const user = await prisma.user.upsert({
    where: { email: 'enrik.b94@live.it' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'enrik.b94@live.it',
      password: hashedPassword,
      name: 'Enrik',
    },
  });
  console.log('Created user with id: ', user.id, 'email: ', user.email);

  const resKanjiCreated = await prisma.kanji.createMany({
    data: data.map((kanji) => ({
      literal: kanji.literal,
      codepoint_ucs: kanji.codepoint_ucs,
      codepoint_jis208: kanji.codepoint_jis208,
      radical_classical: kanji.radical_classical,
      radical_nelson_c: kanji.radical_nelson_c,
      grade: kanji.grade,
      stroke_count: kanji.stroke_count,
      dic_number_classical: kanji.dic_number_classical,
      dic_number_nelson_c: kanji.dic_number_nelson_c,
      reading_ja_on: kanji.reading_ja_on,
      reading_ja_kun: kanji.reading_ja_kun,
      meaning_en: kanji.meaning_en,
      meaning_fr: kanji.meaning_fr,
      meaning_es: kanji.meaning_es,
      meaning_pt: kanji.meaning_pt,
      nanori: kanji.nanori,
      is_base: false,
      svg_path: `0${kanji.literal}.svg`,
    })),
    skipDuplicates: true,
  });

  console.log('Created ', resKanjiCreated.count, 'kanji in Kanji table');

  const resKanjiRelationCreated = await prisma.kanjiRelationship
    .createMany({
      data: dataRelations.map((kanjiRelation) => ({
        ...kanjiRelation,
        radical_type: RadicalType[kanjiRelation.radical_type],
        relation_type: RelationType[kanjiRelation.relation_type],
      })),
      skipDuplicates: true,
    })
    .catch((e) => {
      console.error('Error: ', e);
      process.exit(1);
    });

  console.log(
    'Created ',
    resKanjiRelationCreated.count,
    'kanji relationships in KanjiRelationship table',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
