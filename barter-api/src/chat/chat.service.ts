// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { buildSystemPrompt } from '../utils/buildSystemPrompt';

@Injectable()
export class ChatService {
  streamLlamaResponse(userId: number, userInput: string): Observable<string> {
    return new Observable((subscriber) => {
      (async () => {
        const prompt = await buildSystemPrompt(userId, userInput); // ⬅️

        if (!process.env.URL_LLM) {
          subscriber.error('Environment variable URL_LLM is not defined');
          return;
        }

        const response = await fetch(process.env.URL_LLM, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'mistral',
            prompt,
            stream: true,
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        if (!reader) {
          subscriber.error('Brak readera z Ollama');
          return;
        }

        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                subscriber.next(parsed.response);
              }
            } catch (e) {
              console.warn('Błąd parsowania linii:', line);
            }
          }

          buffer = lines[lines.length - 1];
        }

        subscriber.complete();
      })();
    });
  }
}

