import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock response object
  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
  };

  // Test data
  const mockUser = {
    _id: 'mockUserId',
    dni: 12345678,
    first_name: 'Test',
    last_name: 'User',
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      // Arrange
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser as any);

      // Act
      const result = await controller.register(mockRegisterDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual({
        category: 'register',
        user: mockUser
      });
    });
  });

  describe('login', () => {
    it('should call authService.login, set cookie and return user', async () => {
      // Arrange
      jest.spyOn(authService, 'login').mockResolvedValue({
        token: 'mock.jwt.token',
        user: mockUser as any
      });

      // Act
      const result = await controller.login(mockLoginDto, mockResponse as any);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'usercookie',
        'mock.jwt.token',
        expect.objectContaining({
          maxAge: 3600000,
          httpOnly: true,
        })
      );
      expect(result).toEqual({
        category: 'login',
        user: mockUser
      });
    });
  });

  describe('logout', () => {
    it('should clear cookie and return category', async () => {
      // Act
      const result = await controller.logout(mockResponse as any);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'usercookie',
        "",
        expect.objectContaining({
          expires: expect.any(Date),
          httpOnly: true,
        })
      );
      expect(result).toEqual({ category: 'logout' });
    });
  });
});
