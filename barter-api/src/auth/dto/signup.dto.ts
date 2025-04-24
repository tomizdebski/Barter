import { IsNotEmpty, IsString, IsEmail, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'securePass123',
    description: 'Password (3–20 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password must be between 3 and 20 characters' })
  public password: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Optional avatar URL',
    nullable: true,
  })
  @IsOptional()
  public avatar?: string | null;
}


