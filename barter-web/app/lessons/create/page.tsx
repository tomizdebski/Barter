"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext"; 

const schema = z.object({
  name: z.string().min(3, "Lesson title is required"),
  content: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  photo: z.any().optional(),
  video: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddLessonPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }

    fetchCategories();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    if (!user?.id) {
      console.error("User not logged in");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("content", data.content);
    formData.append("categoryId", data.categoryId);
    formData.append("instructorId", user.id.toString());
    if (data.photo?.[0]) formData.append("photo", data.photo[0]);
    if (data.video?.[0]) formData.append("video", data.video[0]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
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
              Share your <br />
              <span className="text-cyan-400">barter lesson</span>
            </h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-start justify-center px-6 py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4"
            encType="multipart/form-data"
          >
            <div className="text-xl font-semibold text-[#00262b] mb-2">Add Lesson</div>

            <input
              {...register("name")}
              type="text"
              placeholder="Lesson title"
              className="w-full px-4 py-2 border border-[#00262b] text-gray-700 "
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

            <textarea
              {...register("content")}
              placeholder="Lesson description..."
              rows={4}
              className="w-full px-4 py-2 border border-[#00262b] text-gray-700 "
            />
            {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}

            <select
              {...register("categoryId")}
              className="w-full px-4 py-2 border border-[#00262b] text-gray-700 "
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}

            {/* Photo Upload */}
            <div>
              <label className="block text-sm text-[#00262b] mb-1 pl-1">Lesson Image</label>
              <label
                htmlFor="photo"
                className="bg-[#00262b] text-white text-sm px-4 py-2 h-10 flex items-center justify-center cursor-pointer hover:bg-[#001a1f] transition w-32 text-center"
              >
                Choose file
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                {...register("photo")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewPhoto(URL.createObjectURL(file));
                  }
                  register("photo").onChange(e); // 🔧 ważne!
                }}
              />
              {previewPhoto && (
                <Image
                  src={previewPhoto}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded mt-2"
                />
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm text-[#00262b] mb-1 pl-1">Lesson Video</label>
              <label
                htmlFor="video"
                className="bg-[#00262b] text-white text-sm px-4 py-2 h-10 flex items-center justify-center cursor-pointer hover:bg-[#001a1f] transition w-32 text-center"
              >
                Choose file
              </label>
              <input
                id="video"
                type="file"
                accept="video/*"
                {...register("video")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewVideo(URL.createObjectURL(file));
                  }
                  register("video").onChange(e); // 🔧 ważne!
                }}
              />
              {previewVideo && (
                <video
                  src={previewVideo}
                  controls
                  className="mt-2 rounded w-full h-auto max-h-48"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#d64000] text-white px-5 py-2 hover:bg-orange-700 transition rounded-full w-full"
            >
              {loading ? "Submitting..." : "Add Lesson"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


