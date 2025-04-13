"use client";

import React from "react";
import Image from "next/image";

type Props = {
  name: string;
  content: string;
  category: string;
  instructor: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  photo?: string | null;
  video?: string | null;
  localization?: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
};

const LessonDetailCard: React.FC<Props> = ({
  name,
  content,
  category,
  instructor,
  photo,
  video,
  localization,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 max-w-5xl mx-auto my-10">
      {/* Nagłówek */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00262b]">{name}</h1>
          <p className="text-sm text-gray-500 mt-1">{category}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {instructor.avatarUrl && (
            <Image
              src={`http://localhost:4000/${instructor.avatarUrl}`}
              alt="Instructor avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <p className="text-sm font-semibold text-[#00262b]">
            {instructor.firstName} {instructor.lastName}
          </p>
        </div>
      </div>

      {/* Obrazek lub wideo */}
      <div className="mt-6">
        {photo ? (
          <Image
            src={`http://localhost:4000/${photo}`}
            alt="Lesson"
            width={800}
            height={400}
            className="w-full rounded object-cover max-h-[400px]"
          />
        ) : video ? (
          <video
            src={`http://localhost:4000/${video}`}
            controls
            className="w-full rounded max-h-[400px]"
          />
        ) : (
          <div className="w-full bg-gray-100 rounded p-10 text-center text-gray-500">
            No media available
          </div>
        )}
      </div>

      {/* Opis */}
      <div className="mt-6 text-gray-800 whitespace-pre-line">
        {content}
      </div>

      {/* Lokalizacja */}
      {localization && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-[#00262b] mb-1">Location</h3>
          <p className="text-sm text-gray-600 mb-3">
            {localization.city}, {localization.region}
          </p>
          <iframe
            src={`https://maps.google.com/maps?q=${localization.lat},${localization.lng}&z=15&output=embed`}
            width="100%"
            height="250"
            className="rounded border"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default LessonDetailCard;

