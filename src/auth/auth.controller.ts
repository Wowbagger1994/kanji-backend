import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() { email, password }: LoginDto, @Res() res: FastifyReply) {
    const tokens = await this.authService.login(email, password);
    res.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: process.env.NODE_ENV === 'production', // Prevents access by JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
      sameSite: 'none', // Protects against CSRF
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    res
      .header('Access-Control-Allow-Origin', 'http://localhost:8081')
      .header('Access-Control-Allow-Headers', 'true');

    return res.send({ accessToken: tokens.accessToken });
  }

  //TODO: Uncomment this code to enable refresh token functionality
  // @Post('refresh')
  // @ApiCookieAuth()
  // @ApiOkResponse({ type: AuthEntity })
  // async refresh(@Req() req: FastifyRequest) {
  //   const refreshToken = req.cookies.refreshToken;
  //   return await this.authService.refresh(refreshToken);
  // }

  //TODO: Remove this code to enable refresh token functionality
  @Post('refresh')
  @ApiOkResponse({ type: AuthEntity })
  async refresh(@Req() req: FastifyRequest) {
    return await this.authService.refresh();
  }

  @Post('logout')
  logout(@Res() res: FastifyReply) {
    res.clearCookie('refreshToken');
    return res.send({ success: true });
  }
}
