// src/chat/chat.controller.ts
import { Controller, Sse, Query } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { ChatService } from './chat.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'Stream LLM response as server-sent events (SSE)' })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID of the user requesting the stream',
    example: '1',
  })
  @ApiQuery({
    name: 'prompt',
    required: true,
    description: 'Prompt sent to the LLM (e.g. Mistral/Ollama)',
    example: 'What is barter?',
  })
  stream(
    @Query('userId') userId: string,
    @Query('prompt') prompt: string,
  ): Observable<string> {
    return from(this.chatService.streamLlamaResponse(parseInt(userId), prompt));
  }
}