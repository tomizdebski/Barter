// app/layout.tsx lub app/quiz/layout.tsx
import { QuizProvider } from "@/contexts/QuizContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuizProvider>{children}</QuizProvider>;
}
