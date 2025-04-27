'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo?: string;
  video?: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  category: {
    name: string;
  };
  localization?: {
    name: string;
  };
};

type Barter = {
  id: number;
  lesson: Lesson;
  offeredLesson: Lesson;
  message?: string;
};

export default function BarterPage() { // <-- UWAGA! To jest default export
  const { id } = useParams();
  const [barter, setBarter] = useState<Barter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBarter = async () => {
      try {
        const res = await fetch(`http://localhost:4000/barters/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Błąd ładowania barteru');
        }

        const data = await res.json();
        setBarter(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBarter();
    }
  }, [id]);

  if (loading) return <div className="text-center p-8">Ładowanie...</div>;
  if (error || !barter) return <div className="text-center p-8">Błąd ładowania barteru.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#00404d] to-[#0077b3] text-white relative overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-1 w-full max-w-7xl z-10">
        <LessonCard lesson={barter.lesson} title="Lekcja do wymiany" up />
        <LessonCard lesson={barter.offeredLesson} title="Twoja oferta" down />
      </div>
    </div>
  );
}

// 👇 To jest funkcja pomocnicza — NIE exportujemy jej osobno
function LessonCard({ lesson, title, up, down }: { lesson: Lesson, title: string, up?: boolean, down?: boolean }) {
  return (
    <div className={`bg-white w-[500px] h-[650px] flex flex-col justify-start items-center shadow-2xl p-6 text-black ${up ? '-translate-y-8' : ''} ${down ? 'translate-y-8' : ''}`}>
      {lesson.photo && (
        <img
          src={lesson.photo.startsWith('http') ? lesson.photo : `http://localhost:4000/uploads/${lesson.photo}`}
          alt="Zdjęcie lekcji"
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}

      <h2 className="text-3xl font-bold mb-2 text-center">{title}</h2>
      <h3 className="text-2xl font-semibold text-center mb-2">{lesson.name}</h3>

      <p className="text-gray-600 text-center text-sm mb-4 px-4">{lesson.content}</p>

      <div className="flex flex-col gap-2 w-full text-sm mt-4">
        <p><span className="font-semibold">Instruktor:</span> {lesson.instructor.firstName} {lesson.instructor.lastName}</p>
        <p><span className="font-semibold">Kategoria:</span> {lesson.category.name}</p>
        {lesson.localization && (
          <p><span className="font-semibold">Lokalizacja:</span> {lesson.localization.name}</p>
        )}
      </div>
    </div>
  );
}


