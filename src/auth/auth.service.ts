//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
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

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '15m', secret: process.env.JWT_ACCESS_TOKEN_SECRET },
      ),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '30d', secret: process.env.JWT_REFRESH_TOKEN_SECRET },
      ),
    };
  }

  //TODO: Uncomment this code to enable refresh token functionality
  // async refresh(token: string): Promise<AuthEntity> {
  //   const payload = this.jwtService.verify(token, {
  //     secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  //   });

  //   const user = await this.prisma.user.findUnique({
  //     where: { id: payload.userId },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`No user found for ID: ${payload.userId}`);
  //   }

  //   return {
  //     accessToken: this.jwtService.sign(
  //       { userId: user.id },
  //       { expiresIn: '15m', secret: process.env.JWT_ACCESS_TOKEN_SECRET },
  //     ),
  //     refreshToken: token,
  //   };
  // }

  //TODO: Remove this code to enable refresh token functionality
  async refresh(): Promise<AuthEntity> {
    return {
      accessToken: this.jwtService.sign(
        { userId: 1 },
        { expiresIn: '15m', secret: process.env.JWT_ACCESS_TOKEN_SECRET },
      ),
      refreshToken: '',
    };
  }
}
