'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import UserDropdown from "../UserDropdown";
import { Plus, ShoppingCart, Menu, X } from "lucide-react";
import QuizIcon from "../quiz/QuizIcon";
import { AnimatePresence, motion } from "framer-motion";

const Header: React.FC = () => {
  const pathname = usePathname();
  const hideOnAuthPages = pathname.startsWith("/auth");
  const router = useRouter();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  if (hideOnAuthPages) return null;

  return (
    <header className="bg-white shadow px-4 sm:px-6 py-3 sm:py-4 relative z-50">
      {/* Desktop view */}
      <div className="hidden min-[800px]:flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo/logo.svg"
            alt="Barter Logo"
            width={175}
            height={175}
            className="cursor-pointer min-w-[175px]"
          />
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full max-w-xl mx-4 items-center border border-[#00262b] rounded px-4 py-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for skills or lessons..."
            className="flex-1 text-[#00262b] focus:outline-none"
          />
          <button type="submit" className="ml-2 p-1 hover:opacity-80">
            <Image src="/icons/search.svg" alt="Search icon" width={20} height={20} />
          </button>
        </form>

        {/* Right-side actions */}
        <div className="flex items-center space-x-4">
          <Link href="/quiz">
            <button className="p-2 rounded-full hover:bg-gray-100 items-center justify-center">
              <QuizIcon />
            </button>
          </Link>

          {user && (
            <>
              <Link href="/cart">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <ShoppingCart size={20} className="text-[#00262b]" />
                </button>
              </Link>
              <Link href="/lesson/create">
                <button className="flex items-center justify-center gap-2 w-36 px-4 py-2 rounded-full bg-[#00262b] text-white hover:bg-[#00404d] transition text-sm whitespace-nowrap">
                  <Plus size={16} /> Add Lesson
                </button>
              </Link>
            </>
          )}

          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 text-[#00262b] rounded-full hover:bg-blue-50 transition min-w-[90px] text-sm">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2 bg-[#d64000] text-white rounded-full hover:bg-white hover:border hover:text-[#d64000] transition text-sm">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex min-[800px]:hidden items-center justify-between w-full">
        {/* Left: Avatar (if logged in) or Hamburger (if not) */}
        <div className="flex-shrink-0">
          {user ? (
            <UserDropdown />
          ) : (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <Menu size={24} className="text-[#00262b]" />
            </button>
          )}
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex-1 flex justify-center">
          <Image
            src="/icons/logo_d.svg"
            alt="Barter Icon"
            width={90}
            height={90}
            className="cursor-pointer"
          />
        </Link>

        {/* Right: Search icon */}
        <div className="flex-shrink-0">
          <button onClick={() => setIsSearchOpen(true)} className="p-2">
            <Image src="/icons/search.svg" alt="Search icon" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Mobile auth menu (popup) */}
      {isMenuOpen && !user && (
        <div className="absolute top-16 left-4 right-4 bg-white border shadow-md rounded-lg p-4 flex flex-col gap-2 z-50 min-[800px]:hidden">
          <Link href="/auth/login">
            <button className="w-full text-left text-[#00262b] rounded hover:bg-gray-100 px-4 py-2 text-sm">
              Sign In
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="w-full text-left bg-[#d64000] text-white rounded hover:bg-[#c53700] px-4 py-2 text-sm">
              Register
            </button>
          </Link>
        </div>
      )}

      {/* Mobile slide-in search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 flex flex-col gap-4 min-[800px]:hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[#00262b] text-lg">Search</span>
              <button onClick={() => setIsSearchOpen(false)} aria-label="Close search">
                <X size={24} className="text-[#00262b]" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex items-center border border-[#00262b] rounded px-4 py-2">
              <Image src="/icons/search.svg" alt="Search icon" width={20} height={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for skills or lessons..."
                className="flex-1 text-[#00262b] focus:outline-none ml-2"
                autoFocus
              />
            </form>
            <button
              onClick={handleSearchSubmit}
              className="bg-[#00262b] text-white px-4 py-2 rounded-full text-sm self-end"
            >
              Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;






