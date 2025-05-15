'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo: string;
  instructor: { firstName: string; lastName: string };
  category: { name: string };
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
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:4000/barters/${barterId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setBarter);
  }, [barterId]);

  if (!barter) return <div>Loading...</div>;

  const Section = ({ number, lesson }: { number: number; lesson: Lesson }) => (
    <div className="relative">
      <div className="absolute top-4 left-4 text-6xl text-white opacity-20 font-bold">{number}</div>
      <div
        className="border border-gray-500 p-4 bg-[#00262b] text-white hover:scale-[1.01] transition cursor-pointer"
        onClick={() => router.push(`/lessons/${lesson.id}`)}
      >
        <div className="h-64 w-full mb-4 relative overflow-hidden">
          {lesson.photo ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${lesson.photo}`}
              alt={lesson.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
          )}
        </div>
        <h3 className="text-2xl font-light">{lesson.name}</h3>
        <p className="text-sm text-gray-400 mt-2">{lesson.category.name}</p>
      </div>
    </div>
  );

  return (
    <div className=" bg-[#00262b] text-white px-6 py-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight italic text-center text-[#03c7e8]">Barter Offer</h1>

      {/* Wrapper z relative do wstawienia loga */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Logo Barteru między kartami */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-float">
          <Image
            src="/icons/logo_l.svg"
            alt="Barter Logo"
            width={100}
            height={100}
            className="opacity-90"
          />
        </div>

        {/* Requested & Offered Lesson */}
        <Section number={1} lesson={barter.lesson} />
        <Section number={2} lesson={barter.offeredLesson} />
      </div>

      {/* Message & Buttons */}
      <div className=" border-t border-gray-700 pt-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-light">Message from requester</h3>
          <p className="text-gray-400 mt-2">{barter.message}</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            className="px-6 py-2 border rounded-full border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition"
            onClick={async () => {
              await fetch(`http://localhost:4000/barters/${barter.id}/accept`, { method: 'POST', credentials: 'include' });
              alert('Accepted');
            }}
          >
            Accept
          </button>
          <button
            className="px-6 py-2 border rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition"
            onClick={async () => {
              await fetch(`http://localhost:4000/barters/${barter.id}/reject`, { method: 'POST', credentials: 'include' });
              alert('Rejected');
            }}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};




