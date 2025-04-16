"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsMobileOpen(false); // zamknij na mobile po wyszukaniu
    }
  };

  return (
    <>
      {/* Desktop */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:flex w-full sm:max-w-xl mx-auto items-center border border-[#00262b] rounded px-4 py-2"
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

      {/* Mobile Icon */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="sm:hidden p-2"
        aria-label="Open search"
      >
        <Image
          src="/icons/search.svg"
          alt="Search icon"
          width={24}
          height={24}
        />
      </button>

      {/* Mobile full-screen search */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-fit bg-white shadow-md z-50 p-4 flex flex-col gap-4 sm:hidden"
          >
            <div className="flex items-center gap-2 border border-[#00262b] rounded px-4 py-2">
              <Image
                src="/icons/search.svg"
                alt="Search icon"
                width={20}
                height={20}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for skills or lessons..."
                className="flex-1 text-[#00262b] focus:outline-none "
                autoFocus
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-sm text-[#00262b] rounded-full border border-[#00262b] px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#00262b] text-white px-4 py-2 rounded-full text-sm border-[#00262b]"
              >
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

