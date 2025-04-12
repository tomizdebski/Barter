import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

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


