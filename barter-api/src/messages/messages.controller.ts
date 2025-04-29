import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto'; 
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
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async send(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: SendMessageDto,
  ) {
    await this.messagesService.sendQuestionEmail(
      body.to,
      body.message,
      body.lessonId,
    );
    return { success: true };
  }
}
