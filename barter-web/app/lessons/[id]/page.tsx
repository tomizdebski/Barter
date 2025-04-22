// app/lessons/[id]/page.tsx

import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lesson Details | Barter App',
}

async function getLesson(id: string) {
  try {
    const res = await fetch(`http://localhost:4000/lessons/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error fetching lesson:", err);
    return null;
  }
}

export default async function LessonDetailPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id);
  if (!lesson) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: image and description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full h-72 md:h-96 relative rounded-lg overflow-hidden bg-white">
            <Image
              src={`http://localhost:4000/${lesson.photo}`}
              alt={lesson.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{lesson.name}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Skill: {lesson.category?.name} • Location: {lesson.localization ?? 'Online'}
            </p>
            <p className="leading-relaxed text-gray-700">{lesson.content}</p>
          </div>
        </div>

        {/* Right column: details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Instructor</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-300 relative overflow-hidden">
                <Image
                  src={`http://localhost:4000/${lesson.instructor.avatarUrl}`}
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

          <div className="bg-white p-6 rounded-md shadow-sm flex flex-col gap-3">
            <button className="bg-[#00262b] text-white px-6 py-2 rounded-md hover:bg-[#00404d] transition">
              Propose barter
            </button>
            <button className="border border-[#00262b] text-[#00262b] px-6 py-2 rounded-md hover:bg-gray-100 transition">
              Ask a question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


