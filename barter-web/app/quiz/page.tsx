'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';

type Category = { id: number; name: string };
type Position = { x: number; y: number };

const generatePositions = (count: number): Position[] => {
  const radius = 80;
  const maxWidth = 1000;
  const maxHeight = 600;
  const positions: Position[] = [];

  const isOverlapping = (x: number, y: number) => {
    return positions.some((pos) => {
      const dx = x - pos.x;
      const dy = y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) < radius * 2;
    });
  };

  let attempts = 0;
  while (positions.length < count && attempts < 1000) {
    const x = Math.floor(Math.random() * (maxWidth - 2 * radius)) + radius;
    const y = Math.floor(Math.random() * (maxHeight - 2 * radius)) + radius;
    if (!isOverlapping(x, y)) {
      positions.push({ x, y });
    }
    attempts++;
  }

  return positions;
};

export default function QuizCategorySelector() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [animationDone, setAnimationDone] = useState(false);

  const { setCategory } = useQuiz(); // używamy kontekstu

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:4000/categories');
        const data = await res.json();
        setCategories(data);
        setPositions(generatePositions(data.length));
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }

    fetchCategories();
  }, []);

  // Navigate after animation and set category in context
  useEffect(() => {
    if (animationDone && selectedIndex !== null && categories[selectedIndex]) {
      const topic = categories[selectedIndex].name;
      setCategory(topic); // zapisz kategorię w kontekście
      router.push('/quiz/start'); // bez query stringów!
    }
  }, [animationDone, selectedIndex, categories, router, setCategory]);

  return (
    <div className="fixed inset-0 bg-[#00262b] text-white overflow-hidden z-50">
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Image
            src="/icons/logo_l.svg"
            alt="Barter logo"
            width={40}
            height={40}
          />
        </Link>
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold italic text-center mt-12 mb-6 z-10">
        Choose your quiz topic
      </h1>

      <div className="relative w-full h-full max-w-[1000px] mx-auto">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="absolute flex items-center justify-center w-32 h-32 rounded-full cursor-pointer z-10"
            style={{
              left: positions[index]?.x,
              top: positions[index]?.y,
            }}
            onClick={() => setSelectedIndex(index)}
          >
            {/* Kulka */}
            <motion.div
              className="absolute w-32 h-32 rounded-full z-0"
              style={{
                backgroundColor: `hsl(${(index * 70) % 360}, 80%, 75%)`,
              }}
              animate={
                selectedIndex === index
                  ? {
                      scale: 30,
                      opacity: 0,
                    }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              onAnimationComplete={() => {
                if (selectedIndex === index) {
                  setAnimationDone(true);
                }
              }}
            />

            {/* Napis */}
            <span className="text-sm sm:text-md font-semibold z-10 pointer-events-none text-[#00262b]">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}








