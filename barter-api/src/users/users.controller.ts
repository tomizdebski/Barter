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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users or search by email' })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Optional email to search for a specific user',
    example: 'user@example.com',
  })
  @ApiResponse({ status: 200, description: 'List of users or one user if email is given' })
  async getUsers(@Query('email') email?: string) {
    if (email) {
      return this.usersService.findByEmail(email);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (number)' })
  @ApiResponse({ status: 200, description: 'User found by ID' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (number)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({ status: 500, description: 'Update failed due to server error' })
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
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (number)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
