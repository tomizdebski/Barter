"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col relative">
    
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Image
            src="/icons/logo_l.svg"
            alt="Barter logo"
            width={40}
            height={40}
          />
        </Link>
      </div>

     
      <div className="flex h-1 w-full">
        <div className="basis-[10%] bg-[#7D0F0F]" />
        <div className="basis-[35%] bg-[#C63224]" />
        <div className="basis-[15%] bg-[#00262b]" />
        <div className="basis-[40%] bg-[#00C3F5]" />
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Lewa część */}
        <div className="w-full md:w-1/2 bg-[#00262b] text-white flex items-center justify-center px-10 py-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-[56px] font-black leading-tight">
              Start bartering <br />
              <span className="text-cyan-400">with us</span>
            </h1>
          </div>
        </div>

        {/* Prawa część */}
        <div className="w-full md:w-1/2 flex items-start justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Zakładki */}
            <div className="flex justify-start mb-4 text-sm font-medium text-[#00262b]">
              <button
                className={`px-4 pb-1 border-b-2 transition border-[#00262b] text-[#00262b]`}
                onClick={() => router.push("/auth/register")}
              >
                Register
              </button>
              <button
                className={`px-4 pb-1 border-b-2 transition border-transparent text-gray-400`}
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </button>
            </div>

            

           
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none text-gray-700"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none text-gray-700"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none text-gray-700"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none text-gray-700"
                />
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-[#00262b] mb-1 pl-4">
                    Avatar
                  </label>

                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="avatar"
                      className="bg-[#00262b] text-white text-sm px-4 py-2  cursor-pointer hover:bg-[#001a1f] transition"
                    >
                      Choose file
                    </label>

                    <span
                      id="file-name"
                      className="text-sm text-gray-600 truncate"
                    ></span>
                  </div>

                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="hidden"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name;
                      const label = document.getElementById("file-name");
                      if (label && fileName) label.textContent = fileName;
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#d64000] text-white px-5 py-2  hover:bg-orange-700 transition"
                >
                  Create an account
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
