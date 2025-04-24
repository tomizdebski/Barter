import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiPropertyOptional({
    example: 'Advanced Guitar Techniques',
    description: 'Lesson title (string, optional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated lesson content about advanced techniques',
    description: 'Lesson content/description (string, optional)',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Category ID (number, optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'uploads/photo-123.jpg',
    description: 'Path to uploaded photo (string, optional)',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    example: 'uploads/video-123.mp4',
    description: 'Path to uploaded video (string, optional)',
  })
  @IsOptional()
  @IsString()
  video?: string;
}
