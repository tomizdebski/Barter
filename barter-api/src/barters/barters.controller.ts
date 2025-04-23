import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { BartersService } from './barters.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 🔒 import właściwego guarda
  
  @Controller('api')
  export class BartersController {
    constructor(private readonly bartersService: BartersService) {}
  
    // 🔐 Testowa trasa chroniona przez JWT
    @UseGuards(JwtAuthGuard)
    @Get('secure')
    getSecure(@Request() req) {
      return {
        message: 'You are authenticated',
        user: req.user, // dane z `JwtStrategy.validate`
      };
    }
  
    // 🔐 Lista lekcji użytkownika
    @UseGuards(JwtAuthGuard)
    @Get('user-lessons')
    async getUserLessons(@Request() req) {
      return this.bartersService.getLessonsForUser(Number(req.user.id));
    }
  
    // 🔐 Propozycja barteru
    @UseGuards(JwtAuthGuard)
    @Post('barters')
    async proposeBarter(
      @Request() req,
      @Body()
      body: {
        lessonId: string;
        offeredLessonId: string;
        message?: string;
      },
    ) {
      return this.bartersService.createBarter({
        userId: Number(req.user.id),
        lessonId: Number(body.lessonId),
        offeredLessonId: Number(body.offeredLessonId),
        message: body.message,
      });
    }
  }
  