import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn(), // ✨ Mockujemy findAll
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      // Przygotuj dane zwrotne
      const categories = [
        { id: 1, name: 'Python', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'JavaScript', createdAt: new Date(), updatedAt: new Date() },
      ];

      // Podmień implementację findAll
      jest.spyOn(service, 'findAll').mockResolvedValue(categories);

      // Wywołaj kontroler
      const result = await controller.findAll();

      expect(result).toEqual(categories); // ✅ sprawdzamy czy dostajemy poprawne dane
      expect(service.findAll).toHaveBeenCalled(); // ✅ sprawdzamy czy serwis był wywołany
    });
  });
});


