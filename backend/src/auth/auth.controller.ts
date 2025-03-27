import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response as ResType } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
      sameSite: 'lax',
    });

    const user = data.user;
    return { category: 'login', user };
  };

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Muestra los datos del usuario' })
  @ApiResponse({ status: 200, description: 'Muestra los datos del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async showProfile(@Req() req: Request) {
    const user = await this.authService.profile(req);

    return { category: 'profile', user };
  };

  @Post('logout')
  @ApiOperation({ summary: 'Cierre de sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario deslogueado exitosamente.' })
  async logout(@Res({ passthrough: true }) res: ResType) {
    res.cookie('usercookie', "", {
      expires: new Date(0),
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    return { category: 'logout' };
  };
};
