'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageVideoSwitcher from '@/components/ImageVideoCarousel';
import AskQuestionModal from './AskQuestionModal';
import ProposeBarterModal from './ProposeBarterModal';
import LessonActions from './LessonActions';
import { FavoriteButton } from '@/components/FavoriteButton';

type Lesson = {
  id: string;
  name: string;
  photo?: string;
  video?: string;
  content: string;
  points?: number;
  localization?: string;
  instructor: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  category?: {
    name: string;
  };
};

export default function LessonDetailPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`);
        if (!res.ok) throw new Error('Lesson not found');
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!lesson) return <div className="p-10 text-red-500">Lesson not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ImageVideoSwitcher
            photo={lesson.photo ?? ''}
            video={lesson.video ?? ''}
            title={lesson.name}
          />
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{lesson.name}</h1>
              <FavoriteButton lessonId={Number(lesson.id)} />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Skill: {lesson.category?.name} • Location: {lesson.localization ?? 'Online'}
            </p>
            <p className="leading-relaxed text-gray-700">{lesson.content}</p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Instructor</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-300 relative overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${lesson.instructor.avatar}`}
                  alt={lesson.instructor.firstName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">
                  {lesson.instructor.firstName} {lesson.instructor.lastName}
                </p>
                <p className="text-sm text-gray-600">Instructor on Barter</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Barter value</p>
            <p className="text-lg font-semibold">{lesson.points ?? 0} points</p>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Location</p>
            <p className="text-sm">{lesson.localization ?? 'Online'}</p>
          </div>

          <LessonActions lesson={lesson} />
        </div>
      </div>
    </div>
  );
}
