// app/lessons/[id]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ImageVideoSwitcher from "@/components/ImageVideoCarousel";
import AskQuestionModal from "./AskQuestionModal";
import ProposeBarterModal from "./ProposeBarterModal";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const param = await params;
  const lesson = await getLesson(param.id);
  return {
    title: lesson?.name
      ? `${lesson.name} | Barter App`
      : "Lesson Details | Barter App",
  };
}

async function getLesson(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching lesson:", err);
    return null;
  }
}

export default async function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const lesson = await getLesson(param.id);
  if (!lesson) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: image and description */}
        <div className="lg:col-span-2 space-y-6">
          <ImageVideoSwitcher
            photo={lesson.photo}
            video={lesson.video}
            title={lesson.name}
          />

          <div className="bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{lesson.name}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Skill: {lesson.category?.name} • Location:{" "}
              {lesson.localization ?? "Online"}
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
            <p className="text-sm">{lesson.localization ?? "Online"}</p>
          </div>

          <div className="bg-white p-6 rounded-md shadow-sm flex flex-col gap-3">
            <ProposeBarterModal lessonId={lesson.id} />
            <AskQuestionModal
              lessonId={lesson.id}
              instructorEmail={lesson.instructor.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
