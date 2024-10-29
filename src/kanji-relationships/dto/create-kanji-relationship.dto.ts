import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKanjiRelationshipDto {
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
  @IsOptional()
  @IsInt()
  kanji1_id?: number;

  @ApiProperty({
    description: 'Reference to the second Kanji.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  kanji2_id?: number;

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
  radical_type?: 'tradit' | 'general' | 'nelson';

  @ApiProperty({
    description: 'Type of the Kanji relationship.',
    enum: ['literal', 'logic'],
  })
  @IsEnum(['literal', 'logic'])
  relation_type: 'literal' | 'logic';
}
