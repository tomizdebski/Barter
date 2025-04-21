import { Controller, Sse, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('stream')
  stream(
    @Query('userId') userId: string,
    @Query('prompt') prompt: string,
  ): Observable<string> {
    return this.chatService.streamLlamaResponse(parseInt(userId), prompt);
  }
}
