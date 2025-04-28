import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { of } from 'rxjs';

// Mockowanie funkcji pomocniczej
jest.mock('../utils/buildSystemPrompt', () => ({
  buildSystemPrompt: jest.fn().mockResolvedValue('Mocked system prompt'),
}));

// Mockowanie globalnego fetch
global.fetch = jest.fn();

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if URL_LLM is not defined', (done) => {
    delete process.env.URL_LLM;

    const observable$ = service.streamLlamaResponse(1, 'test prompt');

    observable$.subscribe({
      error: (err) => {
        expect(err).toEqual('Environment variable URL_LLM is not defined');
        done();
      },
    });
  });

  it('should stream responses from LLM', async () => {
    process.env.URL_LLM = 'http://mock-llm-server/stream';

    // Mockowanie fetch
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode(JSON.stringify({ response: 'Hello' }) + '\n') })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (fetch as jest.Mock).mockResolvedValue({
      body: {
        getReader: () => mockReader,
      },
    });

    const observable$ = service.streamLlamaResponse(1, 'test prompt');

    const results: string[] = [];

    await new Promise<void>((resolve, reject) => {
      observable$.subscribe({
        next: (data) => results.push(data),
        error: reject,
        complete: () => {
          expect(results).toEqual(['Hello']);
          resolve();
        },
      });
    });
  });
});

