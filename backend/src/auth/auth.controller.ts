import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response as ResType } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { };

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    const userRegistered = await this.authService.register(dto);
    return { category: 'register', user: userRegistered };
  };

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: ResType) {
    const data = await this.authService.login(dto);

    res.cookie('usercookie', data.token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: false, // Solo 'true' en producción con HTTPS
      sameSite: 'none',
    });

    const user = data.user;
    return { category: 'login', user };
  };

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: ResType) {
    res.cookie('usercookie', "", {
      expires: new Date(0),
      httpOnly: true,
      secure: false,
      sameSite: 'none'
    });
    return { category: 'logout' };
  };
};
