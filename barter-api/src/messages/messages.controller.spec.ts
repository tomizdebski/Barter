import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;
  let messagesService: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: {
            sendQuestionEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    messagesService = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('send', () => {
    it('should call messagesService.sendQuestionEmail with correct parameters', async () => {
      const body = {
        to: 'instructor@example.com',
        message: 'Can you explain the part about strumming again?',
        lessonId: 42,
      };

      await controller.send(body);

      expect(messagesService.sendQuestionEmail).toHaveBeenCalledWith(
        body.to,
        body.message,
        body.lessonId,
      );
    });

    it('should return success true after sending', async () => {
      const body = {
        to: 'test@example.com',
        message: 'Hello teacher!',
        lessonId: 1,
      };

      const result = await controller.send(body);

      expect(result).toEqual({ success: true });
    });
  });
});

