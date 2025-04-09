"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";


const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z
    .any()
    .refine((files) => files && files.length > 0, "Avatar is required")
    .refine(
      (files) => files?.[0]?.size < 2_000_000,
      "Max file size is 2MB"
    ),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);

    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        console.error("Signup failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Image src="/icons/logo_l.svg" alt="Barter logo" width={40} height={40} />
        </Link>
      </div>

      {/* Color bar */}
      <div className="flex h-1 w-full">
        <div className="basis-[10%] bg-[#7D0F0F]" />
        <div className="basis-[35%] bg-[#C63224]" />
        <div className="basis-[15%] bg-[#00262b]" />
        <div className="basis-[40%] bg-[#00C3F5]" />
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side */}
        <div className="w-full md:w-1/2 bg-[#00262b] text-white flex items-center justify-center px-10 py-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-[56px] font-black leading-tight">
              Start bartering <br />
              <span className="text-cyan-400">with us</span>
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex items-start justify-center px-6 py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
            encType="multipart/form-data"
          >
            {/* Tabs */}
            <div className="flex justify-start mb-4 text-sm font-medium text-[#00262b]">
              <button
                type="button"
                className="px-4 pb-1 border-b-2 border-[#00262b] text-[#00262b]"
              >
                Register
              </button>
              <button
                type="button"
                className="px-4 pb-1 border-b-2 border-transparent text-gray-400"
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </button>
            </div>

            {/* First name */}
            <div>
              <input
                {...register("firstName")}
                type="text"
                placeholder="First name"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last name */}
            <div>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
  <input
    {...register("password")}
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded pr-10"
  />
  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    onClick={() => setShowPassword((prev) => !prev)}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.075-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
  {errors.password && (
    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
  )}
</div>


            {/* Avatar */}
            <div>
              <label className="block text-sm text-[#00262b] mb-1 pl-1">Avatar</label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="avatar"
                  className="bg-[#00262b] text-white text-sm px-4 py-2 cursor-pointer hover:bg-[#001a1f] transition rounded"
                >
                  Choose file
                </label>
                <span id="file-name" className="text-sm text-gray-600 truncate" />
              </div>
              <input
                {...register("avatar")}
                type="file"
                id="avatar"
                className="hidden"
                onChange={(e) => {
                  const fileName = e.target.files?.[0]?.name;
                  const label = document.getElementById("file-name");
                  if (label && fileName) label.textContent = fileName;

                  // zaktualizuj RHF (ważne!)
                  register("avatar").onChange(e);
                }}
              />
              {errors.avatar && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.avatar.message as string}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#d64000] text-white px-5 py-2 hover:bg-orange-700 transition rounded-full w-full"
            >
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
