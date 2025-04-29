import { Test, TestingModule } from '@nestjs/testing';
import { BartersController } from './barters.controller';
import { BartersService } from './barters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('BartersController', () => {
  let controller: BartersController;
  let service: BartersService;

  const mockService = {
    getLessonsForUser: jest.fn(),
    createBarter: jest.fn(),
    getBartersSentByUser: jest.fn(),
    getBartersForUserLessons: jest.fn(),
    updateBarterStatus: jest.fn(),
    getBarterById: jest.fn(),
  };

  const mockRequest = {
    user: { id: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BartersController],
      providers: [
        {
          provide: BartersService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<BartersController>(BartersController);
    service = module.get<BartersService>(BartersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSecure', () => {
    it('should return authentication confirmation', () => {
      const result = controller.getSecure(mockRequest as any);
      expect(result).toEqual({
        message: 'You are authenticated',
        user: mockRequest.user,
      });
    });
  });

  describe('getUserLessons', () => {
    it('should return user lessons', async () => {
      const mockLessons = [{ id: 1, name: 'Lesson 1' }];
      mockService.getLessonsForUser.mockResolvedValue(mockLessons);

      const result = await controller.getUserLessons(mockRequest as any);
      expect(result).toEqual(mockLessons);
      expect(service.getLessonsForUser).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  describe('proposeBarter', () => {
    it('should create a barter proposal', async () => {
      const body = { lessonId: '1', offeredLessonId: '2', message: 'Test message' };
      const mockBarter = { id: 1, status: 'PENDING' };
      mockService.createBarter.mockResolvedValue(mockBarter);

      const result = await controller.proposeBarter(mockRequest as any, body);
      expect(result).toEqual(mockBarter);
      expect(service.createBarter).toHaveBeenCalledWith({
        userId: mockRequest.user.id,
        lessonId: Number(body.lessonId),
        offeredLessonId: Number(body.offeredLessonId),
        message: body.message,
      });
    });
  });

  describe('getSentBarters', () => {
    it('should return sent barters', async () => {
      const mockBarters = [{ id: 1, status: 'PENDING' }];
      mockService.getBartersSentByUser.mockResolvedValue(mockBarters);

      const result = await controller.getSentBarters(mockRequest as any);
      expect(result).toEqual(mockBarters);
      expect(service.getBartersSentByUser).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  describe('getReceivedBarters', () => {
    it('should return received barters', async () => {
      const mockBarters = [{ id: 2, status: 'PENDING' }];
      mockService.getBartersForUserLessons.mockResolvedValue(mockBarters);

      const result = await controller.getReceivedBarters(mockRequest as any);
      expect(result).toEqual(mockBarters);
      expect(service.getBartersForUserLessons).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  describe('acceptBarter', () => {
    it('should accept a barter', async () => {
      const mockResult = { id: 1, status: 'ACCEPTED' };
      mockService.updateBarterStatus.mockResolvedValue(mockResult);

      const result = await controller.acceptBarter(mockRequest as any, '1');
      expect(result).toEqual(mockResult);
      expect(service.updateBarterStatus).toHaveBeenCalledWith(1, 'ACCEPTED', mockRequest.user.id);
    });
  });

  describe('rejectBarter', () => {
    it('should reject a barter', async () => {
      const mockResult = { id: 2, status: 'REJECTED' };
      mockService.updateBarterStatus.mockResolvedValue(mockResult);

      const result = await controller.rejectBarter(mockRequest as any, '2');
      expect(result).toEqual(mockResult);
      expect(service.updateBarterStatus).toHaveBeenCalledWith(2, 'REJECTED', mockRequest.user.id);
    });
  });

  describe('getBarterById', () => {
    it('should return a specific barter', async () => {
      const mockBarter = { id: 1, lessonId: 1, offeredLessonId: 2 };
      mockService.getBarterById.mockResolvedValue(mockBarter);

      const result = await controller.getBarterById(mockRequest as any, '1');
      expect(result).toEqual(mockBarter);
      expect(service.getBarterById).toHaveBeenCalledWith(1, mockRequest.user.id);
    });
  });
});

