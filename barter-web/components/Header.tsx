"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import UserDropdown from "./UserDropdown";
import { Plus, ShoppingCart } from "lucide-react";

const Header: React.FC = () => {
  const pathname = usePathname();
  const hideOnAuthPages = pathname.startsWith("/auth");

  const { user } = useUser();

  if (hideOnAuthPages) return null;

  return (
    <header className="bg-white shadow px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          {/* Mini logo (mobile only) */}
          <Image
            src="/icons/logo_d.svg"
            alt="Barter Icon"
            width={64}
            height={64}
            className="block sm:hidden cursor-pointer"
          />
          {/* Full logo (desktop) */}
          <Image
            src="/logo/logo.svg"
            alt="Barter Logo"
            width={175}
            height={175}
            className="hidden sm:block cursor-pointer min-w-[175px]"
          />
        </Link>
      </div>

      {/* Search bar */}
      <SearchBar />

      {/* Buttons + User section */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <Link href="/cart" className="hidden sm:block">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ShoppingCart size={20} className="text-[#00262b]" />
              </button>
            </Link>

            <Link href="/lesson/create">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#00262b] text-white hover:bg-[#00404d] transition text-sm">
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
    </header>
  );
};

export default Header;
