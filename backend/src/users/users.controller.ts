import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { };

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la validación de datos.' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return { category: 'createUser', user: newUser };
  };

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de usuarios' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios obtenido correctamente.' })
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return { category: 'findAllUsers', users: users };
  };

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findUserById(@Param('id') id: string) {
    const userFounded = await this.usersService.findUserById(id);
    return { category: 'findUserById', user: userFounded };
  };

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Actualizar un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la validación de datos.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUserById(id, updateUserDto);
    return { category: 'updateUserById', user: updatedUser };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async removeUserById(@Param('id') id: string) {
    const userRemoved = await this.usersService.removeUserById(id);
    return { category: 'removeUserById', user: userRemoved };
  };
};
