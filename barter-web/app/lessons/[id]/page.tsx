// app/lessons/[id]/page.tsx

import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Placeholder function to simulate fetching a lesson
async function getLesson(id: string) {
  return {
    id,
    title: 'Introduction to Frontend Development',
    description:
      'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites from scratch.',
    thumbnail: '/lessons/frontend.png',
    instructor: {
      name: 'Tomasz Izdebski',
      avatar: '/avatars/instructor.png',
      bio: 'Frontend developer and mentor with 5+ years of experience.',
    },
    skill: 'Frontend Development',
    points: 20,
    location: 'Online',
  }
}

export const metadata: Metadata = {
  title: 'Lesson Details | Barter App',
}

export default async function LessonDetailPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id)
  if (!lesson) return notFound()

  return (
    <div className="min-h-screen bg-[#00262b] text-white py-12 px-4 flex justify-center">
      <div className="bg-white text-gray-800 w-full max-w-4xl p-6 md:p-10 rounded-xl shadow-lg space-y-8">
        <div className="w-full h-56 md:h-80 relative rounded-lg overflow-hidden">
          <Image
            src={lesson.thumbnail}
            alt={lesson.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-gray-600">Skill: {lesson.skill} • Location: {lesson.location}</p>
        </div>

        <p className="text-gray-700 leading-relaxed">{lesson.description}</p>

        <div className="flex items-center gap-4 pt-4">
          <div className="w-14 h-14 rounded-full bg-gray-300 relative overflow-hidden">
            <Image
              src={lesson.instructor.avatar}
              alt={lesson.instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{lesson.instructor.name}</p>
            <p className="text-sm text-gray-600">{lesson.instructor.bio}</p>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition">
            Propose Barter
          </button>
          <span className="text-sm text-gray-600 self-center">Value: {lesson.points} points</span>
        </div>
      </div>
    </div>
  )
}
