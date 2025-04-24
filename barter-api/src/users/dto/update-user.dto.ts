import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'First name (string, optional)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name (string, optional)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Email address (string, optional)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'newPassword123',
    description: 'Password (string, optional)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: 'uploads/avatar-john.png',
    description: 'Path to avatar image (string, optional)',
  })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    enum: Role,
    example: 'USER',
    description: 'User role (enum: USER | ADMIN, optional)',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either ADMIN or USER' })
  role?: Role;
}

