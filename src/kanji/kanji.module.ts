import { Module } from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { KanjiController } from './kanji.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [KanjiController],
  providers: [KanjiService],
  imports: [PrismaModule],
})
export class KanjiModule {}
