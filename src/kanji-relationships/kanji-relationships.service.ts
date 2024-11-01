import { Injectable } from '@nestjs/common';
import { CreateKanjiRelationshipDto } from './dto/create-kanji-relationship.dto';
import { UpdateKanjiRelationshipDto } from './dto/update-kanji-relationship.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KanjiRelationshipsService {
  constructor(private prisma: PrismaService) {}

  create(createKanjiRelationshipDto: CreateKanjiRelationshipDto) {
    if (
      createKanjiRelationshipDto.kanji1_id ===
      createKanjiRelationshipDto.kanji2_id
    ) {
      throw new Error('Kanji cannot be related to itself');
    }
    if (
      createKanjiRelationshipDto.kanji1_id >
      createKanjiRelationshipDto.kanji2_id
    ) {
      const temp = createKanjiRelationshipDto.kanji1_id;
      createKanjiRelationshipDto.kanji1_id =
        createKanjiRelationshipDto.kanji2_id;
      createKanjiRelationshipDto.kanji2_id = temp;
    }
    return this.prisma.kanjiRelationship.create({
      data: createKanjiRelationshipDto,
    });
  }

  findAll() {
    return this.prisma.kanjiRelationship.findMany({
      include: { kanji_result: true, kanji1: true, kanji2: true },
    });
  }

  findOne(id: number) {
    return this.prisma.kanjiRelationship.findUnique({
      where: { id },
      include: { kanji_result: true, kanji1: true, kanji2: true },
    });
  }

  update(id: number, updateKanjiRelationshipDto: UpdateKanjiRelationshipDto) {
    if (
      updateKanjiRelationshipDto.kanji1_id &&
      updateKanjiRelationshipDto.kanji2_id &&
      updateKanjiRelationshipDto.kanji1_id ===
        updateKanjiRelationshipDto.kanji2_id
    ) {
      throw new Error('Kanji cannot be related to itself');
    }
    if (
      (!updateKanjiRelationshipDto.kanji1_id &&
        updateKanjiRelationshipDto.kanji2_id) ||
      (updateKanjiRelationshipDto.kanji1_id &&
        updateKanjiRelationshipDto.kanji2_id &&
        updateKanjiRelationshipDto.kanji1_id >
          updateKanjiRelationshipDto.kanji2_id)
    ) {
      const temp = updateKanjiRelationshipDto.kanji1_id;
      updateKanjiRelationshipDto.kanji1_id =
        updateKanjiRelationshipDto.kanji2_id;
      updateKanjiRelationshipDto.kanji2_id = temp;
    }
    return this.prisma.kanjiRelationship.update({
      where: { id },
      data: {
        kanji1: {
          connect: {
            id: updateKanjiRelationshipDto.kanji1_id,
          },
        },
        kanji2: {
          connect: {
            id: updateKanjiRelationshipDto.kanji2_id,
          },
        },
        radical_type: updateKanjiRelationshipDto.radical_type,
        relation_type: updateKanjiRelationshipDto.relation_type,
      },
    });
  }

  remove(id: number) {
    return this.prisma.kanjiRelationship.delete({ where: { id } });
  }
}
