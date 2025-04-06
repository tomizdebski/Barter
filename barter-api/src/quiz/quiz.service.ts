import { Injectable } from '@nestjs/common';
import { QUIZ } from './db_json'; // Importowanie bazy pytań

@Injectable()
export class QuizService {
  getQuestionsByTopic(topic: string, numQuestions: number) {
    const quiz = QUIZ[topic.toUpperCase()];

    if (!quiz) {
      return { error: `Nie znaleziono pytań dla tematu ${topic}` };
    }

    // Losowe mieszanie pytań i wybieranie odpowiedniej liczby
    const shuffledQuestions = this.shuffleArray(quiz);
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);

    return {
      temat: topic,
      liczbaPytan: selectedQuestions.length,
      pytania: selectedQuestions,
    };
  }

  // Funkcja pomocnicza do mieszania tablicy
  private shuffleArray(array: any[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
