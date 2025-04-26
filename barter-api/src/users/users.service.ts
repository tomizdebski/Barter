import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  // Pobranie wszystkich użytkowników
  async findAll() {
    try {
      return await this.prismaService.users.findMany();
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  // Pobranie użytkownika po emailu
  async findByEmail(email: string) {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    try {
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user by email');
    }
  }

  // Pobranie użytkownika po ID
  async findById(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const user = await this.prismaService.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user by ID');
    }
  }

  // Usunięcie użytkownika
  async deleteUser(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const user = await this.prismaService.users.delete({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to delete user by ID');
    }
  }

  // Aktualizacja użytkownika
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const updatedUser = await this.prismaService.users.update({
        where: { id },
        data: updateUserDto,
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

 
  async getRecentActivities(userId: number) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }
  
    try {
      const lessons = await this.prismaService.lessons.findMany({
        where: { instructorId: userId },
        select: {
          name: true,
          createdAt: true,
        },
      });
  
      const acceptedBarters = await this.prismaService.barters.findMany({
        where: {
          OR: [
            { lesson: { instructorId: userId } },
            { offeredLesson: { instructorId: userId } },
          ],
          status: 'ACCEPTED',
        },
        select: {
          id: true,
          updatedAt: true,
          lesson: { select: { name: true } },
          offeredLesson: { select: { name: true } },
        },
      });
  
      const proposedBarters = await this.prismaService.barters.findMany({
        where: {
          proposerId: userId, // te które użytkownik wysłał
          status: 'PENDING',
        },
        select: {
          id: true,
          createdAt: true,
          lesson: { select: { name: true } },
          offeredLesson: { select: { name: true } },
        },
      });
  
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { updatedAt: true },
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      const activities = [
        ...lessons.map((lesson) => ({
          type: 'LESSON_CREATED',
          description: `You published a new lesson: "${lesson.name}"`,
          date: lesson.createdAt,
        })),
        ...acceptedBarters.map((barter) => ({
          type: 'BARTER_ACCEPTED',
          description: `You exchanged "${barter.offeredLesson.name}" for "${barter.lesson.name}"`,
          date: barter.updatedAt,
        })),
        ...proposedBarters.map((barter) => ({
          type: 'BARTER_PROPOSED',
          description: `You proposed exchanging "${barter.offeredLesson.name}" for "${barter.lesson.name}"`,
          date: barter.createdAt,
        })),
        {
          type: 'PROFILE_UPDATED',
          description: `You updated your profile`,
          date: user.updatedAt ?? new Date(),
        },
      ];
  
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  
      return activities;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch user activities');
    }
  }
  

  // Prywatna funkcja do walidacji emaila
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
