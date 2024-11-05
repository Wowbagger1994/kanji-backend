//src/auth/auth.service.ts
import ms from 'ms';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(user: User, res: FastifyReply): Promise<AuthEntity> {
    const data: AuthEntity = {
      user: user,
      accessToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '1d', secret: process.env.JWT_ACCESS_TOKEN_SECRET },
      ),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '30d', secret: process.env.JWT_REFRESH_TOKEN_SECRET },
      ),
      expiresIn: new Date().setTime(new Date().getTime() + ms('1d')),
    };

    return data;
  }

  async refresh(user: User, res: FastifyReply): Promise<AuthEntity> {
    if (!user) {
      throw new NotFoundException(`No user found for ID: ${user.id}`);
    }

    const data: AuthEntity = {
      user: user,
      accessToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '1d', secret: process.env.JWT_ACCESS_TOKEN_SECRET },
      ),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '30d', secret: process.env.JWT_REFRESH_TOKEN_SECRET },
      ),
      expiresIn: new Date().setTime(new Date().getTime() + ms('1d')),
    };

    return data;
  }

  async verifyUser(email: string, password: string) {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}
