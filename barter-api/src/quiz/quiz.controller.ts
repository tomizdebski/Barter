import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @ApiOperation({ summary: 'Get quiz questions by topic and count' })
  @ApiQuery({
    name: 'count',
    type: Number,
    required: true,
    description: 'Number of questions to return (must be > 0)',
    example: 10,
  })
  @ApiQuery({
    name: 'topic',
    type: String,
    required: true,
    description: 'Topic/category of the quiz',
    example: 'javascript',
  })
  @ApiResponse({
    status: 200,
    description: 'List of quiz questions for the selected topic',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing query parameters',
  })
  getQuestions(
    @Query('count') count: string,
    @Query('topic') topic: string,
  ) {
    const numQuestions = parseInt(count);

    if (isNaN(numQuestions) || numQuestions <= 0) {
      throw new BadRequestException(
        'Invalid count parameter. Must be a positive number.',
      );
    }
    if (!topic || topic.trim() === '') {
      throw new BadRequestException('Topic parameter is required.');
    }

    return this.quizService.getQuestionsByTopic(topic, numQuestions);
  }
}
