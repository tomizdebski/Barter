import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaxFileSize, IsFile, HasMimeType } from 'nestjs-form-data';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Guitar Basics',
    description: 'Lesson title (string, required)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Step-by-step intro to chords and strumming',
    description: 'Lesson content/description (string, required)',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 2,
    description: 'Category ID (number, required)',
  })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    example: 5,
    description: 'Instructor ID (number, required)',
  })
  @IsNumber()
  @Type(() => Number)
  instructorId: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Photo file (image/jpeg, image/png, image/webp; max 5MB)',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5_000_000)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  photo?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Video file (video/mp4, video/webm, video/ogg; max 20MB)',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(20_000_000)
  @HasMimeType(['video/mp4', 'video/webm', 'video/ogg'])
  video?: any;
}
