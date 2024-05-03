import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLoginDto } from './dto/authLogin.dto';
import { AuthRegisterDto } from './dto/authRegister.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() userDto: AuthLoginDto) {
    return this.authService.login(userDto);
  }

  @Public()
  @Post('/register')
  register(@Body() userDto: AuthRegisterDto) {
    return this.authService.register(userDto);
  }

  @Get('/me')
  me(@Req() req) {
    const userId = req.user['userId'];
    return this.authService.me(userId);
  }

  @Get('/logout')
  logout(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshToken(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.get('Authorization').split(' ')[1];
    return this.authService.refreshTokens(refreshToken, userId);
  }
}
