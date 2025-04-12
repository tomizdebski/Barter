"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center justify-center w-full sm:flex-1 sm:max-w-xl sm:mx-6 min-w-[120px]">
      {/* Desktop input */}
      <input
        type="text"
        placeholder="Search for skills or users..."
        className="hidden sm:block w-full pr-10 pl-4 py-2 border border-[#00262b] text-[#00262b] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Search icon */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 p-2"
      >
        <Image
          src="/icons/search.svg"
          alt="Search icon"
          width={20}
          height={20}
        />
      </button>

      {/* Mobile search modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-5 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-[#00262b]"
            >
              <X size={24} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for skills or users..."
              className="w-full px-4 py-2 border border-[#00262b] rounded text-[#00262b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Future results */}
            <div className="mt-4 text-sm text-gray-500">
              Showing results for: <span className="font-medium">{query || "..."}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


