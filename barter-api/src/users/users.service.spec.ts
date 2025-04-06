import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 1, email: 'test@test.com' }];
      mockPrismaService.users.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prismaService.users.findMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException on database error', async () => {
      mockPrismaService.users.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockPrismaService.users.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(user);
      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should throw BadRequestException for invalid email format', async () => {
      await expect(service.findByEmail('invalid-email')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on database error', async () => {
      mockPrismaService.users.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findByEmail('test@test.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockPrismaService.users.findUnique.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(result).toEqual(user);
      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findById(-1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on database error', async () => {
      mockPrismaService.users.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findById(1)).rejects.toThrow(BadRequestException);
    });
  });
});
