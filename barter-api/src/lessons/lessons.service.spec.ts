import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LessonsService', () => {
  let service: LessonsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: PrismaService,
          useValue: {
            lessons: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all lessons', async () => {
      const expected = [{ id: 1, name: 'Lesson 1' }];
      (prisma.lessons.findMany as jest.Mock).mockResolvedValue(expected);

      const result = await service.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('search', () => {
    it('should return lessons matching search query', async () => {
      const expected = [{ id: 1, name: 'Guitar Lesson' }];
      (prisma.lessons.findMany as jest.Mock).mockResolvedValue(expected);

      const result = await service.search('guitar');
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return a lesson by id', async () => {
      const lesson = { id: 1, name: 'Test Lesson' };
      (prisma.lessons.findUnique as jest.Mock).mockResolvedValue(lesson);

      const result = await service.findById('1');
      expect(result).toEqual(lesson);
    });

    it('should throw NotFoundException if lesson not found', async () => {
      (prisma.lessons.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByInstructor', () => {
    it('should return lessons by instructor', async () => {
      const lessons = [{ id: 1, name: 'Lesson 1' }];
      (prisma.lessons.findMany as jest.Mock).mockResolvedValue(lessons);

      const result = await service.findByInstructor(1);
      expect(result).toEqual(lessons);
    });
  });

  describe('create', () => {
    it('should create a new lesson', async () => {
      const dto = {
        name: 'New Lesson',
        content: 'Lesson Content',
        categoryId: '1',
        instructorId: 1,
      };
      const createdLesson = { id: 1, ...dto };
      (prisma.lessons.create as jest.Mock).mockResolvedValue(createdLesson);

      const result = await service.create(dto);
      expect(result).toEqual(createdLesson);
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const dto = { name: 'Updated Lesson' };
      const updatedLesson = { id: 1, name: 'Updated Lesson' };
      (prisma.lessons.update as jest.Mock).mockResolvedValue(updatedLesson);

      const result = await service.update('1', dto);
      expect(result).toEqual(updatedLesson);
    });
  });

  describe('delete', () => {
    it('should delete a lesson', async () => {
      const deletedLesson = { id: 1, name: 'Deleted Lesson' };
      (prisma.lessons.delete as jest.Mock).mockResolvedValue(deletedLesson);

      const result = await service.delete('1');
      expect(result).toEqual(deletedLesson);
    });
  });
});

