import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { KanjiModule } from './kanji/kanji.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KanjiRelationshipsModule } from './kanji-relationships/kanji-relationships.module';

@Module({
  imports: [PrismaModule, KanjiModule, UsersModule, AuthModule, KanjiRelationshipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
