"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { ChevronDown } from "lucide-react";

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

  return (
    <div className="relative text-[#00262b]" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
      >
        <Image
          src={`http://localhost:4000/${user.avatarUrl}`}
          alt={user.email}
          width={42}
          height={42}
          className="w-[42px] h-[42px] rounded-full object-cover"
        />
        <ChevronDown size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-50">
          <div className="p-4 border-b flex items-center gap-3">
  <Image
    src={`http://localhost:4000/${user.avatarUrl}`}
    alt="Avatar"
    width={40}
    height={40}
    className="w-10 h-10 rounded-full object-cover"
  />
  <div>
    <p className="font-bold text-sm">
      {user.firstName} {user.lastName}
    </p>
    <p className="text-xs text-gray-500">{user.email}</p>
  </div>
</div>


          <div className="text-sm text-[#00262b]">
            <div className="px-4 py-2 text-gray-500 uppercase text-xs">Switch Dashboard</div>
            <button className="w-full text-left px-4 py-2 hover:bg-[#00262b] hover:text-white">Personal</button>
            <button className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-100">
              Career <span className="bg-yellow-300 text-xs px-2 py-0.5 rounded">New</span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Account</button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Order History</button>
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;