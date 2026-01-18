import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. create user
    const user = await this.authService.register(body.email, body.password);

    // 2. generate token
    const token = this.authService.generateToken(user.id);

    // 3. set cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    // 4. return user information
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. validate user and get token
    const { user, access_token } = await this.authService.login(
      body.email,
      body.password,
    );

    // 2. set cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    // 3. return user information
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/',
    });

    return {
      message: 'logout success',
    };
  }
}
