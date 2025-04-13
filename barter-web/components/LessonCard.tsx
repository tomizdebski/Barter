"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import LessonDetailCard from "./LessonDetailCard";

export type LessonCardProps = {
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
  name,
  content,
  photo,
  video,
  categoryName,
  instructorName,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const pastelColor = useMemo(() => getRandomPastel(), []);

  return (
    <>
      <div
        className="rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition hover:scale-[1.01]"
        onClick={() => setShowDetail(true)}
      >
        <div className="w-full h-40" style={{ backgroundColor: pastelColor }}>
          {photo ? (
            <Image
              src={`http://localhost:4000/${photo}`}
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
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-[#00262b]">{name}</h3>
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

      {/* Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-[#00262b] text-2xl font-bold"
              onClick={() => setShowDetail(false)}
              aria-label="Close"
            >
              ×
            </button>
            <LessonDetailCard
              name={name}
              content={content}
              category={categoryName}
              instructor={{
                firstName: instructorName.split(" ")[0],
                lastName: instructorName.split(" ")[1] || "",
              }}
              photo={photo}
              video={video}
              localization={undefined}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LessonCard;


