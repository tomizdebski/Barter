import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MessagesService', () => {
  let service: MessagesService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(), // podmieniamy metodę na "mock"
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendQuestionEmail', () => {
    it('should call mailerService.sendMail with correct parameters', async () => {
      const to = 'test@example.com';
      const message = 'This is a test message';
      const lessonId = 123;

      await service.sendQuestionEmail(to, message, lessonId);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to,
        subject: `New question about lesson #${lessonId}`,
        text: message,
        html: expect.stringContaining(message),
      });
    });
  });
});
