// context/QuizContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type QuizContextType = {
  category: string | null;
  setCategory: (category: string) => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<string | null>(null);

  return (
    <QuizContext.Provider value={{ category, setCategory }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
