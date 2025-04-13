import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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
          { category: { name: { contains: query, mode: 'insensitive' } } }, // <-- tu!
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
        instructorId: 2, // zamień na userId z tokena, jeśli już masz auth
      },
    });
  }
}


