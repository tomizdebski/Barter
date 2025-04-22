import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async send(
    @Body()
    body: { to: string; message: string; lessonId: number },
  ) {
    await this.messagesService.sendQuestionEmail(body.to, body.message, body.lessonId);
    return { success: true };
  }
}

