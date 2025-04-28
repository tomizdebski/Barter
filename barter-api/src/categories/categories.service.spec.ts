import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            categories: {
              findMany: jest.fn(),  // ✨ Mock Prisma categories.findMany
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      // Mockowany wynik
      const mockCategories = [
        { id: 1, name: 'Python' },
        { id: 2, name: 'DevOps' },
      ];

      // Podmieniamy implementację prisma.categories.findMany
      (prisma.categories.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);        // ✅ sprawdzamy zwrotkę
      expect(prisma.categories.findMany).toHaveBeenCalled(); // ✅ sprawdzamy czy metoda została wywołana
    });
  });
});

