"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z
    .any()
    .refine((files) => files && files.length > 0, "Avatar is required")
    .refine((files) => files?.[0]?.size < 2_000_000, "Max file size is 2MB"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarAccepted, setAvatarAccepted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

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

    const file = data.avatar?.[0];

    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        formData.append("avatar", blob, "avatar.png");
        await submitForm(formData);
      }, "image/png");
    } else if (file) {
      formData.append("avatar", file);
      await submitForm(formData);
    } else {
      console.error("Brak avatara – nie można wysłać formularza.");
    }
  };

  const submitForm = async (formData: FormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setAvatarFile(null);
        setAvatarPreview(null);
        setAvatarAccepted(false);
        router.push("/auth/login");
      } else {
        const text = await res.text();
        console.error("Signup failed:", text);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Image src="/icons/logo_l.svg" alt="Barter logo" width={40} height={40} />
        </Link>
      </div>

      <div className="flex h-1 w-full">
        <div className="basis-[10%] bg-[#7D0F0F]" />
        <div className="basis-[35%] bg-[#C63224]" />
        <div className="basis-[15%] bg-[#00262b]" />
        <div className="basis-[40%] bg-[#00C3F5]" />
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-1/2 bg-[#00262b] text-white flex items-center justify-center px-10 py-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-8xl italic font-black leading-tight">
              Start bartering <br />
              <span className="text-cyan-400">with us</span>
            </h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-start justify-center px-6 py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
            encType="multipart/form-data"
          >
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

            <div>
              <input
                {...register("firstName")}
                type="text"
                placeholder="First name"
                className="w-full px-4 py-2 border border-[#00262b] text-gray-700"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-2 border border-[#00262b] text-gray-700"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-[#00262b] text-gray-700 "
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border border-[#00262b] text-gray-700 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00262b] transition"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="">
              <label className="block text-sm text-[#00262b] mb-1 pl-1">Avatar</label>

              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="avatar"
                  className="bg-[#00262b] text-white text-sm px-4 py-2 h-10 flex items-center justify-center cursor-pointer hover:bg-[#001a1f] transition w-32 text-center"
                >
                  Choose file
                </label>

                {avatarAccepted && avatarPreview && (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
              </div>

              <input
                {...register("avatar")}
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    setAvatarAccepted(false);
                    setAvatarPreview(null);
                  }
                  register("avatar").onChange(e);
                }}
              />

              {avatarFile && !avatarAccepted && (
                <div className="flex flex-col gap-2 items-center">
                  <AvatarEditor
                    ref={editorRef}
                    image={avatarFile}
                    width={100}
                    height={100}
                    border={20}
                    borderRadius={50}
                    color={[255, 255, 255, 0.6]}
                    scale={scale}
                  />
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.01"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editorRef.current) {
                        const canvas = editorRef.current.getImageScaledToCanvas();
                        const url = canvas.toDataURL();
                        setAvatarPreview(url);
                        setAvatarAccepted(true);
                      }
                    }}
                    className="mt-2 bg-green-600 text-white text-sm px-4 py-1 rounded hover:bg-green-700 transition"
                  >
                    Accept avatar
                  </button>
                </div>
              )}

              {errors.avatar && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.avatar.message as string}
                </p>
              )}
            </div>

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
