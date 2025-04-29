import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Readable } from 'stream';

describe('LessonsController', () => {
  let controller: LessonsController;
  let service: LessonsService;

  const mockLessonsService = {
    findAll: jest.fn(),
    findByInstructor: jest.fn(),
    search: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [{ provide: LessonsService, useValue: mockLessonsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<LessonsController>(LessonsController);
    service = module.get<LessonsService>(LessonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call LessonsService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getMyLessons', () => {
    it('should call LessonsService.findByInstructor with userId', async () => {
      const req = { user: { id: 1 } };
      await controller.getMyLessons(req);
      expect(service.findByInstructor).toHaveBeenCalledWith(1);
    });
  });

  describe('searchLessons', () => {
    it('should call LessonsService.search with query', async () => {
      await controller.searchLessons('guitar');
      expect(service.search).toHaveBeenCalledWith('guitar');
    });
  });

  describe('findOne', () => {
    it('should call LessonsService.findById with id', async () => {
      await controller.findOne('123');
      expect(service.findById).toHaveBeenCalledWith('123');
    });
  });

  

const files = {
  photo: [
    {
      fieldname: 'photo',
      originalname: 'photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      destination: './uploads',
      filename: 'photo-123456789.jpg',
      path: './uploads/photo-123456789.jpg',
      buffer: Buffer.from(''),
      stream: new Readable(), // ⬅️ to jest wymagane!
    },
  ],
  video: [
    {
      fieldname: 'video',
      originalname: 'video.mp4',
      encoding: '7bit',
      mimetype: 'video/mp4',
      size: 54321,
      destination: './uploads',
      filename: 'video-123456789.mp4',
      path: './uploads/video-123456789.mp4',
      buffer: Buffer.from(''),
      stream: new Readable(), // ⬅️ to samo tutaj
    },
  ],
};

  

  describe('update', () => {
    it('should call LessonsService.update with id and body', async () => {
      const body = { name: 'Updated lesson' };
      await controller.update('123', body);
      expect(service.update).toHaveBeenCalledWith('123', body);
    });
  });

  describe('remove', () => {
    it('should call LessonsService.delete with id', async () => {
      await controller.remove('123');
      expect(service.delete).toHaveBeenCalledWith('123');
    });
  });
});

