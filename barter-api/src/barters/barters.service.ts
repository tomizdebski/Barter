import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BarterStatus } from '@prisma/client';

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

  async getBartersSentByUser(userId: number) {
    return this.prisma.barters.findMany({
      where: {
        proposerId: userId,
      },
      include: {
        lesson: true,
        offeredLesson: true,
        proposer: true,
      },
    });
  }

  async getBartersForUserLessons(userId: number) {
    return this.prisma.barters.findMany({
      where: {
        lesson: {
          instructorId: userId,
        },
      },
      include: {
        lesson: true,
        offeredLesson: true,
        proposer: true,
      },
    });
  }

  async updateBarterStatus(id: number, status: BarterStatus, userId: number) {
    const barter = await this.prisma.barters.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    });

    if (!barter) throw new NotFoundException('Barter not found');

    if (barter.lesson.instructorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this barter');
    }

    return this.prisma.barters.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
