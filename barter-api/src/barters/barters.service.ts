import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BartersService {
  constructor(private prisma: PrismaService) {}

  async getLessonsForUser(userId: number) {
    return this.prisma.lessons.findMany({
      where: {
        instructorId: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createBarter(data: {
    userId: number;
    lessonId: number;
    offeredLessonId: number;
    message?: string;
  }) {
    return this.prisma.barters.create({
      data: {
        lessonId: data.lessonId,
        offeredLessonId: data.offeredLessonId,
        message: data.message,
        proposerId: data.userId,
      },
    });
  }
}

