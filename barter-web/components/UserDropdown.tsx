"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";

const UserDropdown: React.FC = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarUrl = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`
    : "/icons/default-avatar.jpg"; // Fallback jeśli brak avatara

  return (
    <div className="relative text-[#00262b]" ref={dropdownRef}>
      {/* Avatar + strzałka */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
      >
        <Image
          src={avatarUrl}
          alt={user.email}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover"
        />
        <ChevronDown
          size={18}
          className={`${open ? "rotate-180" : ""} transition`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute top-12 right-0 w-[92vw] max-w-[320px] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-4 z-50 flex flex-col gap-4
            min-[800px]:absolute min-[800px]:right-0 min-[800px]:top-12
            max-[799px]:fixed max-[799px]:top-[64px] max-[799px]:left-0 max-[799px]:right-0 max-[799px]:w-full max-[799px]:max-w-full max-[799px]:rounded-none
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="font-bold text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close dropdown">
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm text-[#00262b]">
            <Link href="/dashboard" className="hover:bg-gray-100 rounded px-4 py-2">
              Dashboard
            </Link>
            <Link href="/account" className="hover:bg-gray-100 rounded px-4 py-2">
              Account
            </Link>
            <Link href="/lessons/create" className="hover:bg-gray-100 rounded px-4 py-2">
              Add Lesson
            </Link>
            <Link href="/my-favourites" className="hover:bg-gray-100 rounded px-4 py-2">
              My Favourites
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full text-left text-red-600 hover:bg-red-50 rounded px-4 py-2 border-t pt-3 border-gray-200 mt-2"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;



