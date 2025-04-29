'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User, BookOpen, MapPin, Video } from 'lucide-react'; // Ikony!

// ⭐ Typy danych
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

export default function BarterPage() {
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
          throw new Error('Failed to load barter');
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error || !barter) return <div className="text-center p-8">Error loading barter.</div>;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Pasek kolorów na górze */}
      <div className="flex h-1 w-full">
        <div className="basis-[10%] bg-[#7D0F0F]" />
        <div className="basis-[35%] bg-[#C63224]" />
        <div className="basis-[15%] bg-[#00262b]" />
        <div className="basis-[40%] bg-[#00C3F5]" />
      </div>

      {/* Dwie połowy */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Lewa część - ciemne tło */}
        <div className="bg-[#00262b] w-full md:w-1/2 flex items-center justify-center p-8">
          <LessonCard lesson={barter.lesson} title="Lesson to Exchange" isDarkSide />
        </div>

        {/* Prawa część - jasne tło */}
        <div className="bg-white w-full md:w-1/2 flex items-center justify-center p-8">
          <LessonCard lesson={barter.offeredLesson} title="Your Offer" />
        </div>
      </div>
    </div>
  );
}

function LessonCard({ lesson, title, isDarkSide }: { lesson: Lesson; title: string; isDarkSide?: boolean }) {
  const cardBg = isDarkSide ? "bg-white text-black" : "bg-[#00262b] text-white";
  const textColor = isDarkSide ? "text-[#00262b]" : "text-cyan-400";

  return (
    <div
      className={`w-full max-w-2xl min-h-[750px] flex flex-col items-center justify-start rounded-3xl shadow-lg overflow-hidden ${cardBg}
                  transform transition-all duration-500 hover:scale-[1.02]`}
    >
      {/* FULL WIDTH PHOTO */}
      {lesson.photo && (
        <img
          src={lesson.photo.startsWith('http') ? lesson.photo : `http://localhost:4000/${lesson.photo}`}
          alt="Lesson photo"
          className="w-full h-64 object-cover"
        />
      )}

      {/* Card Content */}
      <div className="p-8 flex flex-col items-start w-full">
        <h2 className={`text-2xl font-bold mb-2 text-center ${textColor}`}>{title}</h2>
        <h3 className="text-3xl font-semibold text-center mb-6">{lesson.name}</h3>

        {/* Lesson description */}
        <p className={` text-base mb-6 px-6 ${isDarkSide ? "text-gray-700" : "text-gray-300"}`}>
          {lesson.content}
        </p>

        {/* Additional lesson information */}
        <div className="flex flex-col gap-3 w-full text-sm">
          <div className="flex items-center gap-2">
            <User size={18} />
            <p>
              <span className="font-semibold">Instructor:</span> {lesson.instructor.firstName} {lesson.instructor.lastName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <p>
              <span className="font-semibold">Category:</span> {lesson.category.name}
            </p>
          </div>

          {lesson.localization && (
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <p>
                <span className="font-semibold">Location:</span> {lesson.localization.name}
              </p>
            </div>
          )}

          {/* Video preview */}
          {lesson.video && (
            <div className="flex flex-col items-center mt-6 w-full">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
                <video
                  controls
                  className="w-full object-cover"
                  src={lesson.video.startsWith('http') ? lesson.video : `http://localhost:4000/${lesson.video}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <Video size={16} />
                <span>Lesson preview video</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






