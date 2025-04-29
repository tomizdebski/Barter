import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lessons.findMany({
      include: { category: true, instructor: true },
    });
  }

  async findById(id: string) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: Number(id) },
      include: { category: true, instructor: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async create(dto: CreateLessonDto, photo?: Express.Multer.File, video?: Express.Multer.File) {
    return this.prisma.lessons.create({
      data: {
        name: dto.name,
        content: dto.content,
        categoryId: dto.categoryId,
        instructorId: dto.instructorId,
        photo: photo?.filename || null,
        video: video?.filename || null,
      },
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    return this.prisma.lessons.update({
      where: { id: Number(id) },
      data: {
        name: dto.name,
        content: dto.content,
        categoryId: dto.categoryId,
        photo: dto.photo,
        video: dto.video,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.lessons.delete({
      where: { id: Number(id) },
    });
  }

  async search(query: string) {
    return this.prisma.lessons.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findByInstructor(instructorId: number) {
    return this.prisma.lessons.findMany({
      where: { instructorId },
    });
  }
}


