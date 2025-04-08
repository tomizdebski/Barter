"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const pathname = usePathname();
  const hideOnAuthPages = pathname.startsWith("/auth");

  if (hideOnAuthPages) return null;

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo/logo.svg"
            alt="Barter Logo"
            width={175}
            height={175}
            className="cursor-pointer min-w-[175px]"
          />
        </Link>
      </div>

      {/* Search bar */}
      <SearchBar />

      {/* Buttons */}
      <div className="flex space-x-4">
        <Link href="/auth/login">
          <button className="px-4 py-2 text-[#00262b] rounded-full hover:bg-blue-50 transition min-w-[90px]">
            Sign In
          </button>
        </Link>
        <Link href="/auth/register">
          <button className="px-4 py-2 bg-[#d64000] text-white rounded-full hover:bg-white hover:border hover:text-[#d64000] transition">
            Register
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
