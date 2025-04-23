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

@Controller('barters')
export class BartersController {
  constructor(private readonly bartersService: BartersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('secure')
  getSecure(@Request() req) {
    return {
      message: 'You are authenticated',
      user: req.user, // dane z `JwtStrategy.validate`
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-lessons')
  async getUserLessons(@Request() req) {
    return this.bartersService.getLessonsForUser(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('propose-lessons')
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

  @UseGuards(JwtAuthGuard)
  @Get('sent')
  getSentBarters(@Request() req) {
    return this.bartersService.getBartersSentByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incoming')
  getReceivedBarters(@Request() req) {
    return this.bartersService.getBartersForUserLessons(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptBarter(@Request() req, @Body() body: { id: number }) {
    return this.bartersService.updateBarterStatus(
      body.id,
      'ACCEPTED',
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reject')
  rejectBarter(@Request() req, @Body() body: { id: number }) {
    return this.bartersService.updateBarterStatus(
      body.id,
      'REJECTED',
      req.user.id,
    );
  }
}
