import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lessons.findMany({
      include: {
        category: true,
        instructor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async search(query: string) {
    return this.prisma.lessons.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findManyByIds(ids: number[]) {
    return this.prisma.lessons.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        photo: true,
        category: {
          select: { name: true }
        }
      }
    });
  }
  

  async findById(id: string) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        instructor: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async findByInstructor(userId: number) {
    return this.prisma.lessons.findMany({
      where: {
        instructorId: userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    dto: any,
    photo?: Express.Multer.File,
    video?: Express.Multer.File,
  ) {
    return this.prisma.lessons.create({
      data: {
        name: dto.name,
        content: dto.content,
        categoryId: parseInt(dto.categoryId),
        photo: photo ? `uploads/${photo.filename}` : null,
        video: video ? `uploads/${video.filename}` : null,
        instructorId: dto.instructorId,
      },
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    return this.prisma.lessons.update({
      where: { id: parseInt(id) },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.lessons.delete({
      where: { id: parseInt(id) },
    });
  }
}



