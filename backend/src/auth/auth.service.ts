import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { isValidPassword } from '../utils/bcrypt.util';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { };

  async register(dto: RegisterDto) {
    // Verificar si existe un usuario con ese DNI
    const userExists = await this.usersService.findUserByDni(dto.dni);
    if (userExists) {
      throw new ConflictException({ category: 'register', message: 'User DNI already exist' });
    };

    // Creamos el usuario usando UsersService
    const user = await this.usersService.createUser({ ...dto });

    return user;
  };

  async login(dto: LoginDto) {
    // Se busca usuario por dni
    const user = await this.usersService.findUserByDni(dto.dni);

    if (user?.dni !== dto.dni || !isValidPassword(dto.password, user)) {
      throw new UnauthorizedException({ category: 'login', message: 'Invalid credentials' });
    };

    // Generar JWT
    const payload = { sub: user?._id, dni: user?.dni, role: user?.role };
    const token = await this.jwtService.signAsync(payload);

    return { token: token, user: user };
  };

  async profile(req: any) {
    // Si el usuario ya se loggeó, el request manejaria los datos del payload de jwt
    const userPayload = req.user as { userId: string };

    // Se busca al usuario del payload en la base de datos y se retorna
    const fullUserData = await this.usersService.findUserById(userPayload.userId);
    return fullUserData;
  };
};
