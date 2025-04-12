import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
    IsNumberString,
    Validate,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { MaxFileSize, IsFile, HasMimeType } from 'nestjs-form-data';
  
  export class CreateLessonDto {
    @IsString()
    @IsNotEmpty({ message: 'Lesson title is required' })
    name: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Lesson description is required' })
    content: string;
  
    @IsNumberString({}, { message: 'Category ID must be a number string' })
    @IsNotEmpty({ message: 'Category is required' })
    categoryId: string;
  
    
    @IsOptional()
    @IsFile()
    @MaxFileSize(5_000_000, { message: 'Photo must be under 5MB' })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], {
      message: 'Photo must be a valid image file (jpeg, png, webp)',
    })
    photo?: any;
  
    
    @IsOptional()
    @IsFile()
    @MaxFileSize(20_000_000, { message: 'Video must be under 20MB' })
    @HasMimeType(['video/mp4', 'video/webm', 'video/ogg'], {
      message: 'Video must be a valid video file',
    })
    video?: any;
  }
  
