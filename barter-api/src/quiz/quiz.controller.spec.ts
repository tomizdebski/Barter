import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { BadRequestException } from '@nestjs/common';

describe('QuizController', () => {
  let controller: QuizController;
  let quizService: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: {
            getQuestionsByTopic: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    quizService = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuestions', () => {
    it('should return questions when valid parameters are provided', async () => {
      const mockQuestions = [
        { question: 'What is JavaScript?', answer: 'Programming language' },
      ];

      (quizService.getQuestionsByTopic as jest.Mock).mockResolvedValue(mockQuestions);

      const result = await controller.getQuestions('1', 'javascript');

      expect(result).toEqual(mockQuestions);
      expect(quizService.getQuestionsByTopic).toHaveBeenCalledWith('javascript', 1);
    });

    it('should throw BadRequestException if count is invalid', () => {
      expect(() => controller.getQuestions('0', 'javascript')).toThrow(BadRequestException);
      expect(() => controller.getQuestions('abc', 'javascript')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if topic is missing', () => {
      expect(() => controller.getQuestions('5', '')).toThrow(BadRequestException);
      expect(() => controller.getQuestions('5', '   ')).toThrow(BadRequestException);
    });
  });
});


