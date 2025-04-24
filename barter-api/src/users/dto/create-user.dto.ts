import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name (string, required)',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name (string, required)',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address (valid email format, required)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'superSecure123',
    description: 'User password (string, required)',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: 'uploads/avatar-john.png',
    description: 'Optional avatar file path (string, optional)',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

