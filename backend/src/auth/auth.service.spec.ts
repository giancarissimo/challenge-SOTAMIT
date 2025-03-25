import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcryptUtil from '../utils/bcrypt.util';

// Mock the bcrypt utility
jest.mock('../utils/bcrypt.util', () => ({
  isValidPassword: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Test data
  const mockUser = {
    _id: 'mockUserId',
    dni: 12345678,
    password: 'hashedPassword123',
    role: 'user',
  };

  const mockRegisterDto: RegisterDto = {
    first_name: 'Test',
    last_name: 'User',
    dni: 12345678,
    birthdate: '1990-01-01',
    is_developer: true,
    description: 'Test Description',
    work_area: 'IT',
    password: 'password123',
  };

  const mockLoginDto: LoginDto = {
    dni: 12345678,
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByDni: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserByDni').mockResolvedValue(null);
      jest.spyOn(usersService, 'createUser').mockResolvedValue({ ...mockUser } as any);

      // Act
      const result = await service.register(mockRegisterDto);

      // Assert
      expect(usersService.findUserByDni).toHaveBeenCalledWith(mockRegisterDto.dni);
      expect(usersService.createUser).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when user with DNI already exists', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserByDni').mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(service.register(mockRegisterDto)).rejects.toThrow(ConflictException);
      expect(usersService.findUserByDni).toHaveBeenCalledWith(mockRegisterDto.dni);
      expect(usersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should authenticate user and return token and user', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserByDni').mockResolvedValue(mockUser as any);
      jest.spyOn(bcryptUtil, 'isValidPassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock.jwt.token');

      // Act
      const result = await service.login(mockLoginDto);

      // Assert
      expect(usersService.findUserByDni).toHaveBeenCalledWith(mockLoginDto.dni);
      expect(bcryptUtil.isValidPassword).toHaveBeenCalledWith(mockLoginDto.password, mockUser);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        dni: mockUser.dni,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: 'mock.jwt.token',
        user: mockUser,
      });
    });

    it('should throw UnauthorizedException when DNI is not found', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserByDni').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findUserByDni).toHaveBeenCalledWith(mockLoginDto.dni);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserByDni').mockResolvedValue(mockUser as any);
      jest.spyOn(bcryptUtil, 'isValidPassword').mockReturnValue(false);

      // Act & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findUserByDni).toHaveBeenCalledWith(mockLoginDto.dni);
      expect(bcryptUtil.isValidPassword).toHaveBeenCalledWith(mockLoginDto.password, mockUser);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
