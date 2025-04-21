import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ChatService {
  async askLlama(prompt: string): Promise<string> {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
      }),
    });

    const data = await res.json();
    console.log('🧠 Odpowiedź z LLaMA:', data);

    // Sprawdź czy pole `response` istnieje
    if (!data.response) {
      console.warn('⚠️ Brak odpowiedzi od LLaMA!');
      return '[Brak odpowiedzi]';
    }

    return data.response;
  }
}

