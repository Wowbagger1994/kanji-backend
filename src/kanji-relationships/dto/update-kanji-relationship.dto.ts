import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateKanjiRelationshipDto } from './create-kanji-relationship.dto';
import { Exclude } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateKanjiRelationshipDto extends PartialType(
  OmitType(CreateKanjiRelationshipDto, [
    'kanji_result_id',
    'codepoint_ucs_res',
  ] as const),
) {
  @Exclude()
  kanji_result_id?: number;

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

  @Exclude()
  codepoint_ucs_res?: string;

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
  @IsOptional()
  @IsEnum(['literal', 'logic'])
  relation_type: 'literal' | 'logic';
}
