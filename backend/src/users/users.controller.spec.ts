import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Test data
  const mockUser = {
    _id: 'mockUserId',
    first_name: 'Test',
    last_name: 'User',
    dni: 12345678,
    birthdate: new Date('1990-01-01'),
    is_developer: true,
    description: 'Test description',
    work_area: 'IT',
    password: 'hashedPassword123',
    role: 'user',
  };

  const mockUsers = [
    mockUser,
    { ...mockUser, _id: 'anotherUserId', first_name: 'Another', dni: 87654321 }
  ];

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            updateUserById: jest.fn(),
            removeUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call usersService.createUser and return result', async () => {
      // Arrange
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser as any);

      // Act
      const result = await controller.createUser(mockCreateUserDto);

      // Assert
      expect(usersService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual({
        category: 'createUser',
        user: mockUser
      });
    });
  });

  describe('findAllUsers', () => {
    it('should call usersService.findAllUsers and return result', async () => {
      // Arrange
      jest.spyOn(usersService, 'findAllUsers').mockResolvedValue(mockUsers as any);

      // Act
      const result = await controller.findAllUsers();

      // Assert
      expect(usersService.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual({
        category: 'findAllUsers',
        users: mockUsers
      });
    });
  });

  describe('findUserById', () => {
    it('should call usersService.findUserById and return result', async () => {
      // Arrange
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(mockUser as any);
      const userId = 'mockUserId';

      // Act
      const result = await controller.findUserById(userId);

      // Assert
      expect(usersService.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        category: 'findUserById',
        user: mockUser
      });
    });
  });

  describe('updateUserById', () => {
    it('should call usersService.updateUserById and return result', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      jest.spyOn(usersService, 'updateUserById').mockResolvedValue(updatedUser as any);
      const userId = 'mockUserId';

      // Act
      const result = await controller.updateUserById(userId, mockUpdateUserDto);

      // Assert
      expect(usersService.updateUserById).toHaveBeenCalledWith(userId, mockUpdateUserDto);
      expect(result).toEqual({
        category: 'updateUserById',
        user: updatedUser
      });
    });
  });

  describe('removeUserById', () => {
    it('should call usersService.removeUserById and return success message', async () => {
      // Arrange
      jest.spyOn(usersService, 'removeUserById').mockResolvedValue(undefined);
      const userId = 'mockUserId';

      // Act
      const result = await controller.removeUserById(userId);

      // Assert
      expect(usersService.removeUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        category: 'removeUserById',
        user: undefined
      });
    });
  });
});
