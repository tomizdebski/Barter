'use client';

import { useEffect, useState } from 'react';
import LessonCard, { LessonCardProps } from '@/components/LessonCard';

export default function MyFavouritesPage() {
  const [favourites, setFavourites] = useState<LessonCardProps[]>([]);

  useEffect(() => {
    let favoriteIds: number[] = [];

    try {
      const stored = localStorage.getItem('favorites');
      favoriteIds = stored ? JSON.parse(stored) : [];
    } catch {
      favoriteIds = [];
    }

    if (favoriteIds.length === 0) {
      setFavourites([]);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/by-ids?ids=${favoriteIds.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped: LessonCardProps[] = data.map((lesson: any) => ({
          id: lesson.id,
          name: lesson.name,
          content: lesson.content,
          photo: lesson.photo,
          video: lesson.video,
          categoryName: lesson.category?.name || 'Uncategorized',
          instructorName: `${lesson.instructor?.firstName || ''} ${lesson.instructor?.lastName || ''}`,
        }));
        setFavourites(mapped);
      })
      .catch((err) => {
        console.error('Błąd pobierania ulubionych lekcji:', err);
        setFavourites([]);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-[75nvh]">
      {/* Główna treść */}
      <main className="flex-grow max-w-6xl mx-auto py-16 px-4 text-[#00262b] flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Lessons</h1>

        {favourites.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            You don’t have any favorite lessons yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favourites.map((lesson) => (
              <LessonCard key={lesson.id} {...lesson} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      
    </div>
  );
}
