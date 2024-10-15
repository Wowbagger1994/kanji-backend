// src/kanji/entities/kanji.entity.ts

import { Kanji } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class KanjiEntity implements Kanji {
  @ApiProperty({
    description: 'Auto-incremented primary key ID',
  })
  id: number; // Auto-incremented primary key ID

  @ApiProperty({
    description: 'Unique literal value of the Kanji character',
  })
  literal: string; // Unique literal value of the Kanji character

  @ApiProperty({
    description: 'UCS codepoint of the Kanji character (optional)',
    required: false,
    nullable: true,
  })
  codepoint_ucs: string | null; // UCS codepoint of the Kanji character (optional)

  @ApiProperty({
    description: 'JIS208 codepoint of the Kanji character (optional)',
    required: false,
    nullable: true,
  })
  codepoint_jis208: string | null; // JIS208 codepoint of the Kanji character (optional)

  @ApiProperty({
    description: 'Classical radical number (optional)',
    required: false,
    nullable: true,
  })
  radical_classical: number | null; // Classical radical number (optional)

  @ApiProperty({
    description: 'Nelson radical number (optional)',
    required: false,
    nullable: true,
  })
  radical_nelson_c: number | null; // Nelson radical number (optional)

  @ApiProperty({
    description: 'School grade level associated with the Kanji character',
  })
  grade: number; // School grade level associated with the Kanji character

  @ApiProperty({
    description: 'Number of strokes in the Kanji character',
  })
  stroke_count: number; // Number of strokes in the Kanji character

  @ApiProperty({
    description: 'Classical dictionary number (optional)',
    required: false,
    nullable: true,
  })
  dic_number_classical: number | null; // Classical dictionary number (optional)

  @ApiProperty({
    description: 'Nelson dictionary number (optional)',
    required: false,
    nullable: true,
  })
  dic_number_nelson_c: number | null; // Nelson dictionary number (optional)

  @ApiProperty({
    description: 'On reading in Japanese (optional)',
    required: false,
    nullable: true,
  })
  reading_ja_on: string | null; // On reading in Japanese (optional)

  @ApiProperty({
    description: 'Kun reading in Japanese (optional)',
    required: false,
    nullable: true,
  })
  reading_ja_kun: string | null; // Kun reading in Japanese (optional)

  @ApiProperty({
    description: 'English meanings (array of strings)',
    type: [String],
  })
  meaning_en: string[]; // English meanings (array of strings)

  @ApiProperty({
    description: 'French meanings (array of strings)',
    type: [String],
  })
  meaning_fr: string[]; // French meanings (array of strings)

  @ApiProperty({
    description: 'Spanish meanings (array of strings)',
    type: [String],
  })
  meaning_es: string[]; // Spanish meanings (array of strings)

  @ApiProperty({
    description: 'Portuguese meanings (array of strings)',
    type: [String],
  })
  meaning_pt: string[]; // Portuguese meanings (array of strings)

  @ApiProperty({
    description: 'Nanori readings (array of strings)',
    type: [String],
  })
  nanori: string[]; // Nanori readings (array of strings)

  @ApiProperty({
    description: 'Indicates if the Kanji character is a base character',
    default: false,
  })
  is_base: boolean; // Indicates if the Kanji character is a base character
}
