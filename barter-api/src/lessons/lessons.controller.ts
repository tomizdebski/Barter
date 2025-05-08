import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LessonsService } from './lessons.service';
import { extname } from 'path';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'List of all lessons' })
  async findAll() {
    return this.lessonsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get lessons created by the current user' })
  @ApiResponse({ status: 200, description: "List of user's lessons" })
  @UseGuards(JwtAuthGuard) // 🔥 jeśli masz auth (np. JWT Guard)
  async getMyLessons(@Req() req: any) {
    const userId = req.user.id; // lub req.user.id zależnie jak masz JWT
    return this.lessonsService.findByInstructor(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search lessons by keyword' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term',
    example: 'guitar',
  })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchLessons(@Query('q') query: string) {
    return this.lessonsService.search(query);
  }

  @Get('by-ids')
  @ApiOperation({ summary: 'Get multiple lessons by ID array' })
  @ApiQuery({
    name: 'ids',
    required: true,
    example: '1,2,3',
    description: 'Comma-separated lesson IDs',
  })
  @ApiResponse({ status: 200, description: 'Array of lessons' })
  async findByIds(@Query('ids') ids: string) {
    const idsArray = ids
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    return this.lessonsService.findManyByIds(idsArray);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Single lesson' })
  async findOne(@Param('id') id: string) {
    return this.lessonsService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new lesson with optional photo and video',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLessonDto }) 
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Body() body: CreateLessonDto,
  ) {
    const photo = files.photo?.[0];
    const video = files.video?.[0];

    return this.lessonsService.create(body, photo, video);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID to update' })
  @ApiBody({ type: UpdateLessonDto })
  @ApiResponse({ status: 200, description: 'Lesson updated' })
  async update(@Param('id') id: string, @Body() body: UpdateLessonDto) {
    return this.lessonsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID to delete' })
  @ApiResponse({ status: 200, description: 'Lesson deleted' })
  async remove(@Param('id') id: string) {
    return this.lessonsService.delete(id);
  }
}
