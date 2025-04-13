"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type Question = {
  Question: string;
  Answer: string;
  Distractor1: string;
  Distractor2: string;
  Distractor3: string;
  shuffledAnswers?: string[];
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "CSS";
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [globalTimer, setGlobalTimer] = useState(300);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch(`http://localhost:4000/quiz?count=20&topic=${topic}`);
      const data = await res.json();

      const questionsWithShuffledAnswers = data.pytania.map((q: Question) => ({
        ...q,
        shuffledAnswers: [q.Answer, q.Distractor1, q.Distractor2, q.Distractor3].sort(() => Math.random() - 0.5),
      }));

      setQuestions(questionsWithShuffledAnswers);
    }

    fetchQuestions();
  }, [topic]);

  useEffect(() => {
    if (globalTimer <= 0) {
      router.push(`/quiz/result?score=${score}&total=${questions.length}`);
    }

    const interval = setInterval(() => {
      setGlobalTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [globalTimer, questions.length, router, score]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.Answer;
    const audio = new Audio(isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3");
    audio.play();

    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        router.push(`/quiz/result?score=${score + (isCorrect ? 1 : 0)}&total=${questions.length}`);
      }
    }, 1500);
  };

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#00262b] text-white">
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#00262b] to-[#00404d] text-white p-4 flex flex-col">
      {/* Logo */}
      <div
        className="absolute top-4 left-4 z-50 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/icons/logo_l.svg" alt="Barter logo" width={40} height={40} />
      </div>

      {/* Timer */}
      <div className="absolute top-4 right-4 text-sm text-orange-300">
        Time left: <span className="font-bold">{globalTimer}s</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6 max-w-2xl w-full"
          >
            <h2 className="text-lg text-cyan-400 mb-2">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <h1 className="text-2xl md:text-3xl font-bold break-words">
              {currentQuestion.Question}
            </h1>

            <div className="grid gap-4 mt-6">
              {currentQuestion.shuffledAnswers!.map((ans, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(ans)}
                  disabled={!!selectedAnswer}
                  className={`w-full min-w-[320px] py-3 px-4 rounded-lg text-left transition text-sm font-medium ${
                    selectedAnswer
                      ? ans === currentQuestion.Answer
                        ? "bg-green-600 text-white"
                        : ans === selectedAnswer
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-white"
                      : "bg-white text-[#00262b] hover:bg-orange-200"
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

