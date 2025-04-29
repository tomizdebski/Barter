// Najpierw mockujemy bazę danych QUIZ
jest.mock('./db_json', () => ({
  QUIZ: {
    JAVASCRIPT: [
      { question: 'What is JS?', answer: 'Programming language' },
      { question: 'What is a closure?', answer: 'Function inside function' },
    ],
    PYTHON: [
      { question: 'What is Python?', answer: 'Programming language' },
    ],
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizService],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestionsByTopic', () => {
    it('should return shuffled questions for valid topic', () => {
      const result = service.getQuestionsByTopic('javascript', 1);

      expect(result.temat).toBe('javascript');
      expect(result.liczbaPytan).toBe(1);
      expect(result.pytania!.length).toBe(1);
      expect(result.pytania![0]).toHaveProperty('question');
      expect(result.pytania![0]).toHaveProperty('answer');
    });

    it('should return error if topic does not exist', () => {
      const result = service.getQuestionsByTopic('nonexistent', 5);

      expect(result).toEqual({
        error: 'Nie znaleziono pytań dla tematu nonexistent',
      });
    });

    it('should return all available questions if count is greater than available', () => {
      const result = service.getQuestionsByTopic('python', 10);

      expect(result.temat).toBe('python');
      expect(result.liczbaPytan).toBe(1); // Tylko 1 pytanie w bazie!
      expect(result.pytania!.length).toBe(1);
    });

    it('should shuffle the array properly', () => {
      const sampleArray = [1, 2, 3, 4, 5];
      const shuffledArray = service['shuffleArray'](sampleArray);

      // Ta sama zawartość
      expect(shuffledArray.sort()).toEqual(sampleArray.sort());

      // Ta sama długość
      expect(shuffledArray.length).toBe(sampleArray.length);
    });
  });
});


