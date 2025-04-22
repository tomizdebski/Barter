// app/profile/page.tsx
"use client";
import { useUser, User } from "@/contexts/UserContext";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#00262b] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top section with dark background */}
      <div className="relative bg-[#00262b] text-white flex flex-col items-center px-4 pt-12 pb-20 overflow-hidden">

        

        {/* Profile Card */}
        <div className="relative bg-white rounded-xl text-gray-800 w-full max-w-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center z-10">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 relative overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatarUrl}`}
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="text-lg font-semibold">{user.firstName +"_"+ user.id}</div>
              <div className="capitalize">{`${user.firstName ?? ''} ${user.lastName ?? ''}`}</div>
              <div className="text-sm text-gray-600">
                Member since <strong>2025</strong> &nbsp; • &nbsp;
                <strong>0</strong> barters
              </div>
            </div>
          </div>

          {/* Button + Info */}
          <div className="flex flex-col items-center md:items-end mt-6 md:mt-0">
            <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">
              View My Records
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center md:text-right max-w-xs">
              Your learner records information is only visible to you. Only your username is visible to others on Barter.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section full white, aligned to profile card */}
      <div className="bg-white text-gray-800 w-full px-4 py-12">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Your barters</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your learner records information is only visible to you. Only your username is visible to others on Barter.
          </p>
          <p className="text-gray-500 italic">
            You don't have any barters yet.
          </p>
        </div>
      </div>
    </div>
    
  );
}
