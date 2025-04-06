import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint do pobierania wszystkich użytkowników
  @Get()
  async getUsers(@Query('email') email?: string) {
    if (email) {
      return this.usersService.findByEmail(email);
    }
    return this.usersService.findAll();
  }

  // Endpoint do pobierania użytkownika po ID
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const updatedUser = await this.usersService.updateUser(
        numericId,
        updateUserDto,
      );
      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error.message.includes('email already exists')) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
