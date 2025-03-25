import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcryptUtil from '../utils/bcrypt.util';

// Mock mongoose and bcrypt utilities
jest.mock('../utils/bcrypt.util', () => ({
  createHash: jest.fn().mockImplementation((password) => `hashed_${password}`),
  isValidPassword: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  // Test data
  const mockDate = new Date('1990-01-01');

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    first_name: 'Test',
    last_name: 'User',
    dni: 12345678,
    birthdate: mockDate,
    is_developer: true,
    description: 'Test description',
    work_area: 'IT',
    password: 'hashed_password123',
    role: 'user',
    toObject: jest.fn().mockReturnThis(),
  };

  const mockCreateUserDto: CreateUserDto = {
    first_name: 'Test',
    last_name: 'User',
    dni: 12345678,
    birthdate: '1990-01-01',
    is_developer: true,
    description: 'Test description',
    work_area: 'IT',
    password: 'password123',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    first_name: 'Updated',
    description: 'Updated description',
  };

  // Mock mongoose model implementation
  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel, 'create').mockImplementation(() => { return Promise.resolve(mockUser as any); });

      // Act
      const result = await service.createUser(mockCreateUserDto);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ dni: mockCreateUserDto.dni });
      expect(bcryptUtil.createHash).toHaveBeenCalledWith(mockCreateUserDto.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when user with DNI already exists', async () => {
      // Arrange
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(ConflictException);
      expect(userModel.findOne).toHaveBeenCalledWith({ dni: mockCreateUserDto.dni });
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = [mockUser, { ...mockUser, _id: 'anotherId' }];
      jest.spyOn(userModel, 'find').mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUsers), } as any);

      // Act
      const result = await service.findAllUsers();

      // Assert
      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      // Arrange
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);

      // Act
      const result = await service.findUserById('507f1f77bcf86cd799439011');

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for invalid object id', async () => {
      // Act & Assert
      await expect(service.findUserById('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findUserById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('findUserByDni', () => {
    it('should return a user by dni', async () => {
      // Arrange
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser as any);

      // Act
      const result = await service.findUserByDni(12345678);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ dni: 12345678 });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.findUserByDni(99999999);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ dni: 99999999 });
      expect(result).toBeNull();
    });
  });

  describe('updateUserById', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser as any);
      mockUser.toObject.mockReturnValue(mockUser);

      // Act
      const result = await service.updateUserById('507f1f77bcf86cd799439011', mockUpdateUserDto);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        mockUpdateUserDto,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException for invalid object id', async () => {
      // Act & Assert
      await expect(service.updateUserById('invalid-id', mockUpdateUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateUserById('507f1f77bcf86cd799439011', mockUpdateUserDto)).rejects.toThrow(NotFoundException);
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw BadRequestException when no data is provided', async () => {
      // Arrange
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(service.updateUserById('507f1f77bcf86cd799439011', {})).rejects.toThrow(BadRequestException);
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw BadRequestException when data is the same', async () => {
      // Arrange
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
      mockUser.toObject.mockReturnValue(mockUser);

      // Act & Assert
      await expect(service.updateUserById('507f1f77bcf86cd799439011', { first_name: mockUser.first_name })).rejects.toThrow(BadRequestException);
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should hash password when updating password', async () => {
      // Arrange
      const plainPassword = 'newpassword123';
      const passwordUpdateDto = { password: plainPassword };
      const updatedUser = { ...mockUser, password: 'hashed_newpassword123' };
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(updatedUser as any);
      mockUser.toObject.mockReturnValue(mockUser);
      jest.spyOn(bcryptUtil, 'isValidPassword').mockReturnValue(false);

      // Act
      const result = await service.updateUserById('507f1f77bcf86cd799439011', passwordUpdateDto);

      // Assert
      // Verificamos que se haya llamado a isValidPassword y createHash con la contraseña en texto plano
      expect(bcryptUtil.isValidPassword).toHaveBeenCalledWith(plainPassword, mockUser);
      expect(bcryptUtil.createHash).toHaveBeenCalledWith(plainPassword);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439011', { password: 'hashed_newpassword123' }, { new: true });
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException when password is the same', async () => {
      // Arrange
      const passwordUpdateDto = { password: 'samepassword123' };
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser as any);
      mockUser.toObject.mockReturnValue(mockUser);
      jest.spyOn(bcryptUtil, 'isValidPassword').mockReturnValue(true);

      // Act & Assert
      await expect(service.updateUserById('507f1f77bcf86cd799439011', passwordUpdateDto)).rejects.toThrow(BadRequestException);
      expect(bcryptUtil.isValidPassword).toHaveBeenCalledWith(passwordUpdateDto.password, mockUser);
    });
  });

  describe('removeUserById', () => {
    it('should remove a user successfully', async () => {
      // Arrange
      jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(mockUser as any);

      // Act
      await service.removeUserById('507f1f77bcf86cd799439011');

      // Assert
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw BadRequestException for invalid object id', async () => {
      // Act & Assert
      await expect(service.removeUserById('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeUserById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
