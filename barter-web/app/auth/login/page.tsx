"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/contexts/UserContext"; 
import type { User } from "@/contexts/UserContext"; 

//  Zod schema
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { setUser } = useUser(); // 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        setServerError(err.message || "Login failed");
        return;
      }

      //  Po udanym logowaniu — dekoduj token i ustaw usera
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Logo */}
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

      {/* Pasek kolorów */}
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
            <h1 className="text-3xl md:text-8xl italic font-black leading-tight">
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
                className="px-4 pb-1 border-b-2 border-transparent text-gray-400"
                onClick={() => router.push("/auth/register")}
              >
                Register
              </button>
              <button
                className="px-4 pb-1 border-b-2 border-[#00262b] text-[#00262b]"
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-#00262b focus:outline-none text-gray-700"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-[#00262b] focus:outline-none text-gray-700 "
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              {/* Submit */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#d64000] text-white px-5 py-2 hover:bg-orange-700 transition rounded-full disabled:opacity-50"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
                <a href="#" className="text-sm text-[#00262b] hover:underline">
                  Forgot password
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

