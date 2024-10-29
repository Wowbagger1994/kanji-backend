import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class UpdateKanjiDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Literal of the kanji character' })
  literal?: string; // Optional field 'literal' for update

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'UCS codepoint' })
  codepoint_ucs?: string; // UCS codepoint, optional

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'JIS208 codepoint' })
  codepoint_jis208?: string; // JIS codepoint, optional

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Classical radical number' })
  radical_classical?: number; // Classical radical number

  @IsOptional()
  @IsInt()
  @ApiProperty({
    type: Number,
    description: 'Nelson dictionary radical number',
  })
  radical_nelson_c?: number; // Nelson dictionary radical number

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Grade level of the kanji' })
  grade?: number; // Grade level of the kanji

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Stroke count' })
  stroke_count?: number; // Stroke count

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Classical dictionary number' })
  dic_number_classical?: number; // Classical dictionary number, can be NULL

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'Nelson dictionary number' })
  dic_number_nelson_c?: number; // Nelson dictionary number, can be NULL

  @IsOptional()
  @IsString()
  @ApiProperty({ type: [String], description: 'On readings in Japanese' })
  reading_ja_on?: string[]; // On reading in Japanese, optional

  @IsOptional()
  @IsString()
  @ApiProperty({ type: [String], description: 'Kun readings in Japanese' })
  reading_ja_kun?: string[]; // Kun reading in Japanese, optional

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Each element must be a string
  @ApiProperty({ type: [String], description: 'English meanings' })
  meaning_en?: string[]; // English meanings (array of strings)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], description: 'French meanings' })
  meaning_fr?: string[]; // French meanings (array of strings)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], description: 'Spanish meanings' })
  meaning_es?: string[]; // Spanish meanings (array of strings)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], description: 'Portuguese meanings' })
  meaning_pt?: string[]; // Portuguese meanings (array of strings)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], description: 'Nanori readings' })
  nanori?: string[]; // Nanori readings (array of strings)

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the kanji is a base character',
  })
  is_base?: boolean; // Indicates if the kanji is a base character, optional
}
