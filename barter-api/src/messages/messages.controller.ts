import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a question email to lesson instructor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          example: 'instructor@example.com',
          description: 'Recipient email address',
        },
        message: {
          type: 'string',
          example: 'Can you explain the part about strumming again?',
          description: 'The message content',
        },
        lessonId: {
          type: 'number',
          example: 42,
          description: 'ID of the related lesson',
        },
      },
      required: ['to', 'message', 'lessonId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async send(
    @Body()
    body: { to: string; message: string; lessonId: number },
  ) {
    await this.messagesService.sendQuestionEmail(
      body.to,
      body.message,
      body.lessonId,
    );
    return { success: true };
  }
}


