import { ApiProperty } from '@nestjs/swagger';
import { KanjiRelationship, Kanji } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class KanjiRelationshipEntity implements KanjiRelationship {
  constructor(partial: Partial<KanjiRelationshipEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'Reference to the Kanji result.',
    required: false,
  })
  @IsInt()
  kanji_result_id: number;

  @ApiProperty({
    description: 'Reference to the first Kanji.',
    required: false,
  })
  kanji_result: Kanji;

  @ApiProperty({
    description: 'Reference to the first Kanji.',
    required: false,
  })
  kanji1?: Kanji | null;

  @ApiProperty({
    description: 'Reference to the second Kanji.',
    required: false,
  })
  kanji2: Kanji | null;

  @ApiProperty({
    description: 'Reference to the first Kanji.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  kanji1_id: number | null;

  @ApiProperty({
    description: 'Reference to the first Kanji.',
    required: false,
  })
  @IsOptional()
  @IsString()
  kanji1_literal: string | null;

  @ApiProperty({
    description: 'Reference to the second Kanji.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  kanji2_id: number | null;

  @IsOptional()
  @IsString()
  kanji2_literal: string | null;

  @ApiProperty({ description: 'UCS codepoint for the resulting Kanji.' })
  @IsString()
  codepoint_ucs_res: string;

  @ApiProperty({
    description: 'Type of the radical.',
    enum: ['tradit', 'general', 'nelson'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['tradit', 'general', 'nelson'])
  radical_type: 'tradit' | 'general' | 'nelson' | null;

  @ApiProperty({
    description: 'Type of the Kanji relationship.',
    enum: ['literal', 'logic'],
  })
  @IsEnum(['literal', 'logic'])
  relation_type: 'literal' | 'logic';
}
