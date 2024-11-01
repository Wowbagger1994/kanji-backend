import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBasicAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { FastifyReply } from 'fastify';
import { LocalAuthGuard } from './guards/local.auth.guards';
import { User } from '@prisma/client';
import { CurrentUser } from './current-user.decorator';
import { RefreshTokenAuthGuard } from './guards/refresh-token.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBasicAuth()
  @ApiOkResponse({ type: AuthEntity })
  async login(@CurrentUser() user: User, @Res() res: FastifyReply) {
    const data = await this.authService.login(user, res);
    return res.send(data);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  @ApiCookieAuth()
  @ApiOkResponse({ type: AuthEntity })
  async refresh(@CurrentUser() user: User, @Res() res: FastifyReply) {
    const data = await this.authService.refresh(user, res);
    return res.send(data);
  }

  @Post('logout')
  logout(@Res() res: FastifyReply) {
    res.clearCookie('refreshToken');
    return res.send({ success: true });
  }
}
