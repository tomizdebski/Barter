'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomTooltip } from './CustomTooltip';

type FavoriteButtonProps = {
  lessonId: number;
};

export const FavoriteButton = ({ lessonId }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    const favorites: number[] = stored ? JSON.parse(stored) : [];
    setIsFavorite(favorites.includes(lessonId));
  }, [lessonId]);

  const toggleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    const stored = localStorage.getItem('favorites');
    const favorites: number[] = stored ? JSON.parse(stored) : [];

    let updated: number[];
    if (favorites.includes(lessonId)) {
      updated = favorites.filter(id => id !== lessonId);
      setIsFavorite(false);
    } else {
      updated = [...favorites, lessonId];
      setIsFavorite(true);
    }

    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const tooltipId = `favorite-tooltip-${lessonId}`;
  const tooltipText = isFavorite ? 'Remove from favourites' : 'Add to favourites';

  return (
    <>
      <div
        onClick={toggleFavorite}
        data-tooltip-id={tooltipId}
        className="inline-block p-2 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <Heart
          size={20}
          className={`text-[#00262b] ${isFavorite ? 'fill-[#00262b]' : 'fill-transparent'}`}
        />
      </div>

      <CustomTooltip id={tooltipId} content={tooltipText} />
    </>
  );
};


