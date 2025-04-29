import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  HttpCode,
} from '@nestjs/common'; // <-- dodajemy też Param!
import { BartersService } from './barters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Barters')
@ApiBearerAuth()
@Controller('barters')
export class BartersController {
  constructor(private readonly bartersService: BartersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('secure')
  @ApiOperation({ summary: 'Check if user is authenticated' })
  @ApiResponse({ status: 200, description: 'Authenticated user info returned' })
  getSecure(@Request() req) {
    return {
      message: 'You are authenticated',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-lessons')
  @ApiOperation({ summary: 'Get lessons owned by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns user lessons' })
  async getUserLessons(@Request() req) {
    return this.bartersService.getLessonsForUser(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('propose-lessons')
  @ApiOperation({ summary: 'Propose a barter for a lesson' })
  @ApiResponse({ status: 201, description: 'Barter proposal created' })
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
  @ApiOperation({ summary: 'Get barters sent by user' })
  @ApiResponse({ status: 200, description: 'List of sent barters' })
  getSentBarters(@Request() req) {
    return this.bartersService.getBartersSentByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incoming')
  @ApiOperation({ summary: 'Get barters received for your lessons' })
  @ApiResponse({ status: 200, description: 'List of received barters' })
  getReceivedBarters(@Request() req) {
    return this.bartersService.getBartersForUserLessons(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  @HttpCode(200)
  @ApiOperation({ summary: 'Accept a barter request' })
  @ApiResponse({ status: 200, description: 'Barter accepted' })
  acceptBarter(@Request() req, @Param('id') id: string) {
    return this.bartersService.updateBarterStatus(
      Number(id),
      'ACCEPTED',
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a barter request' })
  @ApiResponse({ status: 200, description: 'Barter rejected' })
  rejectBarter(@Request() req, @Param('id') id: string) {
    return this.bartersService.updateBarterStatus(
      Number(id),
      'REJECTED',
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific barter by ID' })
  @ApiResponse({ status: 200, description: 'Returns barter details' })
  async getBarterById(@Request() req, @Param('id') id: string) {
    const barterId = Number(id);

    // if (isNaN(barterId)) {
    //   throw new BadRequestException('Invalid barter ID');
    // }

    return this.bartersService.getBarterById(barterId, req.user.id);
  }
}
