import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { of } from 'rxjs';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            streamLlamaResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('stream', () => {
    it('should call chatService.streamLlamaResponse with correct params and return observable', () => {
      // Mockujemy odpowiedź Observable
      const mockObservable = of('Mock response');
      (service.streamLlamaResponse as jest.Mock).mockReturnValue(mockObservable);

      const result = controller.stream('1', 'Tell me about barter');

      expect(service.streamLlamaResponse).toHaveBeenCalledWith(1, 'Tell me about barter');
      expect(result).toEqual(mockObservable);
    });
  });
});

