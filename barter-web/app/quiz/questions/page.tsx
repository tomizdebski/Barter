// app/quiz/questions/page.tsx
import { Suspense } from "react";
import QuizClient from "./QuizClient"; // twój clientowy komponent

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <QuizClient />
    </Suspense>
  );
}
