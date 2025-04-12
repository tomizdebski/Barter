"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(3, "Lesson title is required"),
  content: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  photo: z
    .any()
    .refine((files) => !files || files.length === 0 || files[0]?.size < 5_000_000, "Max photo size is 5MB"),
  video: z
    .any()
    .refine((files) => !files || files.length === 0 || files[0]?.size < 20_000_000, "Max video size is 20MB"),
});

type FormValues = z.infer<typeof schema>;

export default function AddLessonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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
    formData.append("content", data.content);
    formData.append("categoryId", data.categoryId);
    if (data.photo?.[0]) formData.append("photo", data.photo[0]);
    if (data.video?.[0]) formData.append("video", data.video[0]);

    try {
      const res = await fetch("http://localhost:4000/lessons", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Lesson creation failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
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
            <h1 className="text-3xl md:text-8xl italic font-black leading-tight">
              Share your <br />
              <span className="text-cyan-400">barter lesson</span>
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
                Add Lesson
              </button>
            </div>

            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Lesson title"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <textarea
                {...register("content")}
                placeholder="Lesson description..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              />
              {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
            </div>

            <div>
              <select
                {...register("categoryId")}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded"
              >
                <option value="">-- Select category --</option>
                <option value="1">Programming</option>
                <option value="2">Music</option>
                <option value="3">Art</option>
              </select>
              {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            {/* Photo */}
            <div>
             
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="photo"
                  className="bg-[#00262b] text-white text-sm px-4 py-2 h-10 flex items-center justify-center cursor-pointer hover:bg-[#001a1f] transition rounded w-32 text-center"
                >
                  Choose image
                </label>
                {previewPhoto && (
                  <Image
                    src={previewPhoto}
                    alt="Preview"
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                )}
              </div>
              <input
                id="photo"
                type="file"
                accept="image/*"
                {...register("photo")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreviewPhoto(URL.createObjectURL(file));
                }}
                className="hidden"
              />
            </div>

            {/* Video */}
            <div>
              
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="video"
                  className="bg-[#00262b] text-white text-sm px-4 py-2 h-10 flex items-center justify-center cursor-pointer hover:bg-[#001a1f] transition rounded w-32 text-center"
                >
                  Choose video
                </label>
              </div>
              <input
                id="video"
                type="file"
                accept="video/*"
                {...register("video")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreviewVideo(URL.createObjectURL(file));
                }}
                className="hidden"
              />
              {previewVideo && (
                <video src={previewVideo} controls className="mt-2 rounded w-full h-auto max-h-48" />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 hover:bg-green-700 transition rounded-full w-full"
            >
              {loading ? "Submitting..." : "Add Lesson"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

