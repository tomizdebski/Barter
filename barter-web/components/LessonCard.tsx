"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Image from "next/image";
import { FavoriteButton } from "./FavoriteButton";

export type LessonCardProps = {
  id: number;
  name: string;
  content: string;
  photo?: string | null;
  video?: string | null;
  categoryName: string;
  instructorName: string;
};

const getRandomPastel = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 90%)`;
};

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  name,
  content,
  photo,
  video,
  categoryName,
  instructorName,
}) => {
  const router = useRouter();
  const pastelColor = useMemo(() => getRandomPastel(), []);

  return (
    <div
      data-testid="lesson-card"
      className="rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition hover:scale-[1.01]"
      onClick={() => router.push(`/lessons/${id}`)}
    >
      <div className="w-full h-40" style={{ backgroundColor: pastelColor }}>
        {photo ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${photo}`}
            alt={name}
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Tytuł + serduszko */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[#00262b]">{name}</h3>
          <FavoriteButton lessonId={id} />
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{content}</p>
        <p className="text-xs text-gray-400 mt-1">by {instructorName}</p>
      </div>

      <div className="px-4 pb-4 bg-white flex justify-between items-center">
        <span className="inline-block mt-2 bg-[#E1DDD0] text-xs px-3 py-1 rounded-full shadow text-gray-700">
          {categoryName}
        </span>
        {video && (
          <span className="text-xs text-blue-600">🎥 Video included</span>
        )}
      </div>
    </div>
  );
};

export default LessonCard;





