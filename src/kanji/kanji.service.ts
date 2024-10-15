import { Injectable } from '@nestjs/common';
import { UpdateKanjiDto } from './dto/update-kanji.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KanjiService {
  constructor(private prisma: PrismaService) {}

  findAll(page: number, perPage: number) {
    return this.prisma.kanji.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  findBase(page: number, perPage: number) {
    return this.prisma.kanji.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: { is_base: true },
    });
  }

  findOneById(id: number) {
    return this.prisma.kanji.findUnique({ where: { id } });
  }

  findOneByLiteral(kanji: string) {
    return this.prisma.kanji.findUnique({ where: { literal: kanji } });
  }

  update(id: number, updateKanjiDto: UpdateKanjiDto) {
    this.prisma.kanji.update({ where: { id }, data: updateKanjiDto });
  }

  setAsBase(id: number) {
    this.prisma.kanji.update({ where: { id }, data: { is_base: true } });
  }

  setAsNotBase(id: number) {
    this.prisma.kanji.update({ where: { id }, data: { is_base: false } });
  }

  remove(id: number) {
    return this.prisma.kanji.delete({ where: { id } });
  }
}
