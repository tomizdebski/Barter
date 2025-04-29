import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    lessons: {
      findMany: jest.fn(),
    },
    barters: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'test@example.com' }];
      mockPrismaService.users.findMany.mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
    });

    it('should throw BadRequestException on failure', async () => {
      mockPrismaService.users.findMany.mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockPrismaService.users.findUnique.mockResolvedValue(user);

      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });

    it('should throw BadRequestException for invalid email', async () => {
      await expect(service.findByEmail('invalid-email')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.findByEmail('missing@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockPrismaService.users.findUnique.mockResolvedValue(user);

      expect(await service.findById(1)).toEqual(user);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findById(-5)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const user = { id: 1 };
      mockPrismaService.users.delete.mockResolvedValue(user);

      expect(await service.deleteUser(1)).toEqual(user);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.deleteUser(0)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on delete error', async () => {
      mockPrismaService.users.delete.mockRejectedValue(new Error());

      await expect(service.deleteUser(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = { id: 1 };
      const updatedUser = { id: 1, email: 'new@example.com' };

      mockPrismaService.users.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.users.update.mockResolvedValue(updatedUser);

      expect(await service.updateUser(1, { email: 'new@example.com' })).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.updateUser(1, { email: 'test' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException on email conflict', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.users.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.updateUser(1, { email: 'conflict@example.com' })).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on update error', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.users.update.mockRejectedValue(new Error());

      await expect(service.updateUser(1, { email: 'error@example.com' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getRecentActivities', () => {
    it('should return activities sorted by date', async () => {
      mockPrismaService.lessons.findMany.mockResolvedValue([{ name: 'Lesson1', createdAt: new Date() }]);
      mockPrismaService.barters.findMany.mockResolvedValue([]);
      mockPrismaService.users.findUnique.mockResolvedValue({ updatedAt: new Date() });

      const activities = await service.getRecentActivities(1);

      expect(Array.isArray(activities)).toBe(true);
      expect(activities[0]).toHaveProperty('type');
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPrismaService.lessons.findMany.mockRejectedValue(new Error());

      await expect(service.getRecentActivities(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
