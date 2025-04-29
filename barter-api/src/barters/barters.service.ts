import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BarterStatus } from '@prisma/client';

@Injectable()
export class BartersService {
  constructor(private prisma: PrismaService) {}

  async getBarterById(barterId: number, userId: number) {
    const barter = await this.prisma.barters.findUnique({
      where: { id: barterId },
      include: {
        lesson: {
          include: {
            instructor: true,
            category: true,   // <--- DODAJ TO!
          },
        },
        offeredLesson: {
          include: {
            instructor: true,
            category: true,   // <--- DODAJ TO!
          },
        },
      },
    });
  
    if (!barter) {
      throw new NotFoundException('Barter not found');
    }
  
    if (barter.proposerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
  
    return barter;
  }
  
  
  
  

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
        lesson: {
          select: {
            id: true,
            instructorId: true,
            studentId: true,
          },
        },
      },
    });
  
    if (!barter) {
      throw new NotFoundException('Barter not found');
    }
  
  
    
    return this.prisma.barters.update({
      where: { id },
      data: {
        status,
      },
    });
  }
  
  
  
}
