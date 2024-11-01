import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
