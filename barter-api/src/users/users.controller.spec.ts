import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getRecentActivities: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // ✅ wyłączamy auth w testach
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = [{ id: 1, email: 'test@example.com' }];
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.getUsers()).toEqual(result);
    });

    it('should search users by email', async () => {
      const email = 'search@example.com';
      const result = { id: 2, email };
      mockUsersService.findByEmail.mockResolvedValue(result);

      expect(await controller.getUsers(email)).toEqual(result);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockUsersService.findById.mockResolvedValue(user);

      expect(await controller.getUser('1')).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDto = { firstName: 'Updated' };
      const result = { id: 1, ...updateUserDto };

      mockUsersService.updateUser.mockResolvedValue(result);

      expect(await controller.updateUser('1', updateUserDto)).toEqual({
        message: 'User updated successfully',
        data: result,
      });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(controller.updateUser('abc', { firstName: 'Test' })).rejects.toThrow('Invalid user ID');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const result = { message: 'User deleted successfully' };
      mockUsersService.deleteUser.mockResolvedValue(result);

      expect(await controller.deleteUser('1')).toEqual(result);
    });
  });

  describe('getUserActivities', () => {
    it('should get user activities', async () => {
      const activities = [{ id: 1, activity: 'Logged in' }];
      mockUsersService.getRecentActivities.mockResolvedValue(activities);

      expect(await controller.getUserActivities('1')).toEqual(activities);
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      await expect(controller.getUserActivities('abc')).rejects.toThrow('Invalid user ID');
    });
  });
});

