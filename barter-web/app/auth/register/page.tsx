"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 📦 Zod schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    console.log("Form data:", formData);

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

            {/* Name */}
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Last name */}
            <div>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
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

                  // 🔁 ważne! ręcznie wywołujemy RHF obsługę
                  register("avatar").onChange(e);
                }}
              />
              {errors.avatar && <p className="text-sm text-red-600 mt-1">{errors.avatar.message as string}</p>}
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
