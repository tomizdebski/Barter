import { Test, TestingModule } from '@nestjs/testing';
import { BartersService } from './barters.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('BartersService', () => {
  let service: BartersService;
  let prisma: PrismaService;

  const mockPrisma = {
    barters: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BartersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BartersService>(BartersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBarterById', () => {
    const userId = 1;
    const barterId = 100;

    it('should return a barter if found and owned by user', async () => {
      const mockBarter = {
        id: barterId,
        proposerId: userId,
        lesson: { id: 1, name: 'Lesson A' },
        offeredLesson: { id: 2, name: 'Lesson B' },
      };

      mockPrisma.barters.findUnique.mockResolvedValue(mockBarter);

      const result = await service.getBarterById(barterId, userId);

      expect(result).toEqual(mockBarter);
      expect(prisma.barters.findUnique).toHaveBeenCalledWith({
        where: { id: barterId },
        include: {
          lesson: { include: { instructor: true, category: true } },
          offeredLesson: { include: { instructor: true, category: true } },
        },
      });
    });

    it('should throw NotFoundException if barter not found', async () => {
      mockPrisma.barters.findUnique.mockResolvedValue(null);

      await expect(service.getBarterById(barterId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not proposer', async () => {
      const mockBarter = {
        id: barterId,
        proposerId: 999, // not matching userId
        lesson: { id: 1, name: 'Lesson A' },
        offeredLesson: { id: 2, name: 'Lesson B' },
      };

      mockPrisma.barters.findUnique.mockResolvedValue(mockBarter);

      await expect(service.getBarterById(barterId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

