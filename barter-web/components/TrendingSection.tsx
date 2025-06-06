"use client";

import { useEffect, useState } from "react";
import LessonCard from "./LessonCard";

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo?: string | null;
  video?: string | null;
  createdAt: string; // <-- dodane
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, {
          credentials: "include",
        });
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
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

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredLessons = (selectedCategories.length
    ? lessons.filter((lesson) => selectedCategories.includes(lesson.category.name))
    : lessons
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#00262b]">Trending on Barter</h2>

        {/* Categories */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {categories.map((cat, i) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={i}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-1 border text-sm rounded-full transition ${
                  isSelected
                    ? "bg-[#00262b] text-white"
                    : "bg-[#E1DDD0] text-[#00262b] hover:bg-[#00262b] hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sortowanie */}
        <div className="mt-6 flex gap-4 items-center flex-wrap">
          <span className="text-sm font-medium text-[#00262b]">Sort:</span>
          <button
            onClick={() => setSortOrder("newest")}
            className={`text-sm px-3 py-1 border rounded-full transition ${
              sortOrder === "newest"
                ? "bg-[#00262b] text-white"
                : "bg-[#E1DDD0] text-[#00262b] hover:bg-[#00262b] hover:text-white"
            }`}
          >
            From newest
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`text-sm px-3 py-1 border rounded-full transition ${
              sortOrder === "oldest"
                ? "bg-[#00262b] text-white"
                : "bg-[#E1DDD0] text-[#00262b] hover:bg-[#00262b] hover:text-white"
            }`}
          >
            From oldest
          </button>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredLessons.map((lesson) => (
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


