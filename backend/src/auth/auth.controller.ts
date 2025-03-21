import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response as ResType } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { };

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async register(@Body() dto: RegisterDto) {
    const userRegistered = await this.authService.register(dto);
    return { category: 'register', user: userRegistered };
  };

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Inicio de sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado y token enviado en cookie.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
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
  @ApiOperation({ summary: 'Cierre de sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario deslogueado exitosamente.' })
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
