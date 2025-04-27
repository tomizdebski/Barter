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

  // Obsługa kliknięcia poza dropdownem
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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 800;

  return (
    <div className="relative text-[#00262b]" ref={dropdownRef}>
      {/* Avatar + strzałka */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
      >
        <Image
          src={`http://localhost:4000/${user.avatarUrl}`}
          alt={user.email}
          width={36}
          height={36}
          className="min-w-9 min-h-9 rounded-full object-cover"
        />
        <ChevronDown
          size={18}
          className={`${open ? "rotate-180" : ""} transition`}
        />
      </button>

      {/* MOBILE DROPDOWN – pełnoekranowy */}
      {open && (
        <div className="min-[800px]:hidden fixed top-[64px] left-0 w-full bg-white z-50 shadow-md border-t flex flex-col p-4 gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Image
                src={`http://localhost:4000/${user.avatarUrl}`}
                alt="Avatar"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
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

          <div className="text-sm text-[#00262b]">
            <div className="uppercase text-xs text-gray-500 mb-2">
              Switch Dashboard
            </div>
            <button className="w-full text-left px-4 py-2 hover:bg-[#00262b] hover:text-white rounded">
              Personal
            </button>
            <button className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-100 rounded">
              Career{" "}
              <span className="bg-yellow-300 text-xs px-2 py-0.5 rounded">
                New
              </span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Account
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Order History
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t mt-2"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* DESKTOP DROPDOWN */}
      {open && (
        <div className="hidden min-[800px]:block absolute right-2 top-12 w-[92vw] max-w-[280px] sm:w-64 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-50">
          <div className="p-4 border-b flex items-center gap-3">
            <Image
              src={`http://localhost:4000/${user.avatarUrl}`}
              alt="Avatar"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-bold text-sm leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="text-sm text-[#00262b]">
            <Link
              href="/dashboard"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 block"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 block"
            >
              Settings
            </Link>
            <Link
              href="/account"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 block"
            >
              Account
            </Link>
            <Link
              href="/lessons/create"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 block"
            >
              Add lesson
            </Link>
            <Link
              href="/my-basket"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 block"
            >
              My basket
            </Link>
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-t-[#00262b]"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
