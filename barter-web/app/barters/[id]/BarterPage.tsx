'use client';
import { useEffect, useState } from 'react';

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo: string;
  video: string;
  instructor: { firstName: string; lastName: string };
  category: { name: string };
  localization: { name: string };
};

type BarterData = {
  id: number;
  message: string;
  lesson: Lesson;
  offeredLesson: Lesson;
};

type Props = {
  barterId: string | number;
};

export const BarterPage = ({ barterId }: Props) => {
  const [barter, setBarter] = useState<BarterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/barters/${barterId}`)
      .then(res => {
        if (!res.ok) throw new Error('Fetch error');
        return res.json();
      })
      .then(data => setBarter(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [barterId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading barter.</div>;
  if (!barter) return null;

  return (
    <div>
      <h1>{barter.lesson.name}</h1>
      <p>{barter.lesson.content}</p>
      <p>{barter.lesson.instructor.firstName} {barter.lesson.instructor.lastName}</p>
      <p>{barter.lesson.localization.name}</p>

      <h2>{barter.offeredLesson.name}</h2>
      <p>{barter.offeredLesson.content}</p>
      <p>{barter.offeredLesson.instructor.firstName} {barter.offeredLesson.instructor.lastName}</p>
      <p>{barter.offeredLesson.localization.name}</p>
    </div>
  );
};
