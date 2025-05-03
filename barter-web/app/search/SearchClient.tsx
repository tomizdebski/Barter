"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LessonCard from "@/components/LessonCard";
import PromoBanner from "@/components/banners/PromoBanner";

type Lesson = {
  id: number;
  name: string;
  content: string;
  photo?: string;
  category: { name: string };
  instructor: { firstName: string; lastName: string };
};

export default function SearchClient() {
  const [results, setResults] = useState<Lesson[]>([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  const fetchResults = async (term: string) => {
    setQuery(term);
    setSearching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      fetchResults(q);
    }
  }, [searchParams]);

  const handleSearch = (term: string) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams({ q: term });
      window.history.replaceState({}, "", `/search?${params.toString()}`);
      fetchResults(term);
    }
  };

  return (
    <div className="bg-white min-h-screen">
        <PromoBanner/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {searching && (
          <p className="mt-6 text-gray-500 text-center text-sm">
            Searching for: <strong>{query}</strong>
          </p>
        )}

        {!searching && results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[#00262b] mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="italic">"{query}"</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((lesson) => (
                <LessonCard
                id={lesson.id}
                  key={lesson.id}
                  name={lesson.name}
                  content={lesson.content}
                  photo={lesson.photo}
                  video={null}
                  categoryName={lesson.category.name}
                  instructorName={`${lesson.instructor.firstName} ${lesson.instructor.lastName}`}
                />
              ))}
            </div>
          </div>
        )}

        {!searching && results.length === 0 && query && (
          <p className="text-center text-gray-500 mt-10">
            No results found for "<strong>{query}</strong>"
          </p>
        )}
      </div>
    </div>
  );
}
