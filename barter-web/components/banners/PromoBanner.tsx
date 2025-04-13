"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-cyan-400 text-black px-4 py-3 flex items-center justify-between text-sm font-medium">
      <div className="flex-1 text-center">
        <span className="font-bold">Discover the power of skill exchange</span> — Find or share your perfect lesson today! Use the search bar to explore Barter.
        <Link href="/search" className="underline ml-1 font-semibold hover:text-[#00262b] transition">Start searching</Link>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 p-1 hover:text-[#00262b] transition"
        aria-label="Close banner"
      >
        <X size={20} />
      </button>
    </div>
  );
}
