import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsNumber,
} from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNumber({}, { message: 'Category ID must be a number' })
  @Type(() => Number) // <- konwertuje z form-data string -> number
  categoryId: number;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  video?: string;
}
