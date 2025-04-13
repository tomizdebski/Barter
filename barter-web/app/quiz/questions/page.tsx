import { Suspense } from "react";
import QuizQuestionsClient from "./QuizClient";

export default function QuizQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading quiz...</div>}>
      <QuizQuestionsClient />
    </Suspense>
  );
}

