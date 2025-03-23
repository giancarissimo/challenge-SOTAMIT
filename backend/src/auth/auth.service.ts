import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { isValidPassword } from 'src/utils/bcrypt.util';

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
};
