'use client';

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = Number(searchParams.get("score") || 0);
  const total = Number(searchParams.get("total") || 0);
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Perfect! You're a master! 🎉";
    if (percentage >= 80) return "Great job! 💪";
    if (percentage >= 50) return "Not bad! Keep practicing! 🚀";
    return "Don't give up! Try again! 🔁";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#00262b] to-[#00404d] text-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <Image
            src="/icons/logo_l.svg"
            alt="Barter logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-md text-center text-[#00262b] px-8 py-10 max-w-md w-full"
      >
        <h1 className="text-3xl font-extrabold">Your Result</h1>
        <p className="text-xl mt-4">
          You scored <span className="text-orange-600 font-bold">{score}</span> out of{" "}
          <span className="font-bold">{total}</span>
        </p>
        <p className="text-lg mt-2 italic">{getMessage()}</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#00262b] text-white py-2 rounded-full hover:bg-[#00404d] transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
