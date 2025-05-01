'use client';

import { Heart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Lesson = {
  id: number;
  name: string;
  photo?: string | null;
  categoryName: string;
};

const FavouritesDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [favourites, setFavourites] = useState<Lesson[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
  
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
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((lesson: any) => ({
          id: lesson.id,
          name: lesson.name,
          photo: lesson.photo,
          categoryName: lesson.category?.name || 'Uncategorized',
        }));
        setFavourites(mapped);
      })
      .catch((err) => {
        console.error('Błąd pobierania ulubionych lekcji:', err);
        setFavourites([]);
      });
  }, [open]);

  const handleRemove = (lessonId: number) => {
    const stored = localStorage.getItem('favorites');
    let favorites: number[] = stored ? JSON.parse(stored) : [];
  
    favorites = favorites.filter((id) => id !== lessonId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setFavourites((prev) => prev.filter((lesson) => lesson.id !== lessonId));
  };
  
  

  return (
    <div className="relative text-[#00262b]" ref={dropdownRef}>
      {/* Serduszko otwierające */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle favorites dropdown"
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Heart
          size={22}
          className={`transition-transform duration-300 ${
            open ? 'rotate-180 fill-[#00262b]' : 'fill-transparent'
          } text-[#00262b]`}
        />
      </button>

      {/* Dropdown animowany */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-[92vw] max-w-[340px] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-4 z-50 flex flex-col gap-3
              min-[800px]:absolute min-[800px]:right-0 min-[800px]:top-12
              max-[799px]:fixed max-[799px]:top-[64px] max-[799px]:left-0 max-[799px]:right-0 max-[799px]:w-full max-[799px]:rounded-none"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm">Your Favorite Lessons</h3>
              <button onClick={() => setOpen(false)} aria-label="Close dropdown">
                <X size={20} />
              </button>
            </div>

            {favourites.length === 0 ? (
              <p className="text-sm text-gray-500">No favorite lessons yet.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {favourites.map((lesson) => (
                  <li key={lesson.id} className="group flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 transition">
                  <Link href={`/lessons/${lesson.id}`} className="flex items-center gap-3 w-full">
                    {lesson.photo ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${lesson.photo}`}
                        alt={lesson.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 text-xs text-gray-500 flex items-center justify-center">
                        No image
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{lesson.name}</span>
                      <span className="text-xs text-gray-500">{lesson.categoryName}</span>
                    </div>
                  </Link>
                
                  <button
                    onClick={() => handleRemove(lesson.id)}
                    className="text-gray-400 hover:text-red-500 transition ml-2"
                    aria-label="Remove from favorites"
                  >
                    <X size={16} />
                  </button>
                </li>
                
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavouritesDropdown;
