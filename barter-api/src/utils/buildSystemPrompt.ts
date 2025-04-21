// src/chat/utils/buildSystemPrompt.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function buildSystemPrompt(userId: number, userInput: string): Promise<string> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      instructor: { include: { category: true, localization: true } },
      student: { include: { category: true, localization: true } },
      skills: { include: { skill: true } },
    },
  });

  if (!user) return 'Nie znaleziono użytkownika.';

  const instructorLessons = user.instructor.map(
    (l) => `• Instruktor: ${l.name} (${l.category.name}), lokalizacja: ${l.localization?.city || 'online'}`
  ).join('\n') || 'Brak lekcji jako instruktor.';

  const studentLessons = user.student.map(
    (l) => `• Student: ${l.name} (${l.category.name}), lokalizacja: ${l.localization?.city || 'online'}`
  ).join('\n') || 'Brak lekcji jako student.';

  const skills = user.skills.map(({ skill }) =>
    `• ${skill.name} (poziom ${skill.level})`
  ).join('\n') || 'Brak umiejętności.';

  return `
Jesteś AI-asystentem użytkownika platformy Barter.

🧑 Użytkownik: ${user.firstName || ''} ${user.lastName || ''} (${user.email})

🎓 Umiejętności:
${skills}

📘 Lekcje jako instruktor:
${instructorLessons}

📚 Lekcje jako student:
${studentLessons}

Pytanie użytkownika: "${userInput}"

Na podstawie powyższych danych odpowiedz po polsku, zwięźle i przyjaźnie.
`.trim();
}

