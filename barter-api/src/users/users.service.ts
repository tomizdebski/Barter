import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  // Funkcja do pobrania wszystkich użytkowników
  async findAll() {
    try {
      return await this.prismaService.users.findMany();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  // Funkcja do znalezienia użytkownika po emailu
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to fetch user by email');
    }
  }

  // Funkcja do pobrania użytkownika po ID
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to fetch user by ID');
    }
  }

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to delete user by ID');
    }
  }

  // Do poprawy - nie dokonczona funkcja
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Sprawdzenie, czy użytkownik istnieje
    const existingUser = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      // Aktualizacja użytkownika
      const updatedUser = await this.prismaService.users.update({
        where: { id },
        data: updateUserDto,
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2002') {
        // Unikalne pole (np. email) już istnieje
        throw new Error('A user with this email already exists');
      }
      // Rzucanie generycznego wyjątku
      throw new Error('Failed to update user');
    }
  }

  // Prywatna funkcja do walidacji emaila
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
