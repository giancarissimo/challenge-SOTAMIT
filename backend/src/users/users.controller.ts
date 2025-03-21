import { Controller, Get, Post, Body, Param, Patch, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { };

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return { category: 'createUser', user: newUser };
  };

  @Get()
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return { category: 'findAllUsers', users: users };
  };

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const userFounded = await this.usersService.findUserById(id);
    return { category: 'findUserById', user: userFounded };
  };

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUserById(id, updateUserDto);
    return { category: 'updateUserById', user: updatedUser };
  }

  @Delete(':id')
  async removeUserById(@Param('id') id: string) {
    const userRemoved = await this.usersService.removeUserById(id);
    return { category: 'removeUserById', user: userRemoved };
  };
};
