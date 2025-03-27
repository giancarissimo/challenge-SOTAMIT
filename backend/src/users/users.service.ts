import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createHash, isValidPassword } from '../utils/bcrypt.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { };

  // Se crea un usuario en la BD
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Se verifica si ya existe un usuario con ese dni
    const existing = await this.userModel.findOne({ dni: createUserDto.dni });
    if (existing) {
      throw new ConflictException({ category: 'createUser', message: 'Dni already in use' });
    };

    // Se convierte "birthdate" de tipo string a formato Date
    const birthdate = new Date(createUserDto.birthdate);

    // Se aplica el hasheo a "password"
    const password = createHash(createUserDto.password);

    return this.userModel.create({ ...createUserDto, birthdate, password });
  };

  // Se retornan todos los usuarios
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  };

  // Se retorna un usuario por ID de mongodb
  async findUserById(id: string): Promise<User> {
    // Si queremos testear con un _id de mongodb con menos (o más) de 24 caracteres, nos va a tirar error porque no es un id válido.
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ category: 'findUserById', message: `Invalid format: The objectId ${id} must have 24 hex characters` });
    };

    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException({ category: 'findUserById', message: `User with the ${id} was not found` });
    };
    return user;
  };

  // Se retorna un usuario por dni
  async findUserByDni(dni: number): Promise<User | null> {
    return this.userModel.findOne({ dni });
  };

  // Se actualiza un usuario
  async updateUserById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Si queremos testear con un _id de mongodb con menos (o más) de 24 caracteres, nos va a tirar error porque no es un id válido.
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ category: 'updateUserById', message: `Invalid format: The objectId ${id} must have 24 hex characters` });
    };

    // Se busca un usuario en la base de datos con el id que mandamos
    const userToUpdate = await this.userModel.findById(id)
    if (!userToUpdate) {
      throw new NotFoundException({ category: 'updateUserById', message: `User with the id ${id} was not found` });
    };

    // Si hay usuario, pero el usuario no manda ningun objeto a actualizar, tiramos error
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException({ category: 'updateUserById', message: 'No data was provided' });
    };

    // Se excluye 'password' del objeto updateUserDto
    const { password, ...updateData } = updateUserDto;

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true, });
    if (!updatedUser) {
      throw new NotFoundException({ category: 'updateUserById', message: `User with the id ${id} was not found` });
    };
    return updatedUser;
  };

  async updateUserPsasword(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Si queremos testear con un _id de mongodb con menos (o más) de 24 caracteres, nos va a tirar error porque no es un id válido.
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ category: 'updateUserById', message: `Invalid format: The objectId ${id} must have 24 hex characters` });
    };

    // Se busca un usuario en la base de datos con el id que mandamos
    const userToUpdate = await this.userModel.findById(id)
    if (!userToUpdate) {
      throw new NotFoundException({ category: 'updateUserById', message: `User with the id ${id} was not found` });
    };

    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException({ category: 'updateUserById', message: 'No data was provided' });
    };

    // Se valida la propiedad "passowrd" si se envía
    if (updateUserDto.password) {
      // Se compara la contraseña entrante (sin hashear) con la almacenada
      const isSamePassword = isValidPassword(updateUserDto.password, userToUpdate);
      if (isSamePassword) {
        throw new BadRequestException({ category: 'updateUserById', message: 'The new password must be different from the current one' });
      };
      // Se hashea la nueva contraseña
      updateUserDto.password = createHash(updateUserDto.password);
    };

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, });
    if (!updatedUser) {
      throw new NotFoundException({ category: 'updateUserById', message: `User with the id ${id} was not found` });
    };
    return updatedUser;
  };

  // Se elimina un usuario
  async removeUserById(id: string): Promise<void> {
    // Si queremos testear con un _id de mongodb con menos (o más) de 24 caracteres, nos va a tirar error porque no es un id válido.
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ category: 'removeUserById', message: `Invalid format: The objectId ${id} must have 24 hex characters` });
    };

    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException({ category: 'removeUserById', message: `User with the id ${id} was not found` });
    };
  };
};
