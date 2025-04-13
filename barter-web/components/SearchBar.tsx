"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full sm:max-w-xl mx-auto items-center border border-[#00262b] rounded px-4 py-2"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for skills or lessons..."
        className="flex-1 text-[#00262b] focus:outline-none"
        ref={inputRef}
      />
      <button type="submit" className="ml-2 p-1 hover:opacity-80">
        <Image
          src="/icons/search.svg"
          alt="Search icon"
          width={20}
          height={20}
          priority
        />
      </button>
    </form>
  );
}

