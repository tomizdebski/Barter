'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface SkillLesson {
  id: string;
  name: string;
}

export default function ProposeBarterPage() {
  const [userLessons, setUserLessons] = useState<SkillLesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const params = useParams(); // 👈 Pobierz id z URL-a
  const lessonId = params?.id as string;

  useEffect(() => {
    const fetchUserLessons = async () => {
      const res = await fetch('/api/user-lessons');
      const data = await res.json();
      setUserLessons(data);
    };

    fetchUserLessons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/barters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId,
        offeredLessonId: selectedLessonId,
        message,
      }),
    });

    if (res.ok) {
      router.push('/dashboard/barters');
    } else {
      alert('Failed to send proposal');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Propose Barter</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Choose one of your lessons to offer
          </label>
          <select
            value={selectedLessonId}
            onChange={(e) => setSelectedLessonId(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              Select your lesson
            </option>
            {userLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Message to instructor (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-[#00262b] text-white px-6 py-2 rounded-md hover:bg-[#00404d] transition"
        >
          Send Proposal
        </button>
      </form>
    </div>
  );
}

