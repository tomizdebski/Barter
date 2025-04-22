"use client";

import { useEffect, useState } from "react";
import LessonCard from "./LessonCard";

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo?: string | null;
  video?: string | null;
  category: {
    name: string;
  };
  instructor: {
    firstName: string;
    lastName: string;
  };
};

export default function TrendingSection() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("http://localhost:4000/lessons", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched lessons:", data);
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/categories", {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data.map((cat: any) => cat.name));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchLessons();
    fetchCategories();
  }, []);

  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#00262b]">Trending on Barter</h2>

        {/* Categories */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="px-4 py-1 border border-[#00262b] text-sm rounded-full hover:bg-[#00262b] text-[#00262b] hover:text-white transition bg-[#E1DDD0]"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              name={lesson.name}
              content={lesson.content}
              photo={lesson.photo}
              video={lesson.video}
              categoryName={lesson.category.name}
              instructorName={`${lesson.instructor.firstName} ${lesson.instructor.lastName}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="#"
            className="text-[#00262b] underline text-sm font-medium hover:text-orange-600 transition"
          >
            View more popular barter offers
          </a>
        </div>
      </div>
    </section>
  );
}
