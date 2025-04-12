import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Body,
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { CreateLessonDto } from './dto/create-lesson.dto';
  import { LessonsService } from './lessons.service';
  import { extname } from 'path';
  
  @Controller('lessons')
  export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}
  
    @Post()
    @UseInterceptors(FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }))
    async create(
      @Body() body: CreateLessonDto,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      const photo = files.find(f => f.mimetype.startsWith('image/'));
      const video = files.find(f => f.mimetype.startsWith('video/'));
  
      return this.lessonsService.create(body, photo, video);
    }
  }
  
