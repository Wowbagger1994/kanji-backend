import { Module } from '@nestjs/common';
import { KanjiRelationshipsService } from './kanji-relationships.service';
import { KanjiRelationshipsController } from './kanji-relationships.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [KanjiRelationshipsController],
  providers: [KanjiRelationshipsService],
  imports: [PrismaModule],
})
export class KanjiRelationshipsModule {}
