"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const QuizIntro = () => {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const searchParams = useSearchParams();

  const topic = searchParams.get("topic") || "your skills";

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/quiz/questions?topic=${encodeURIComponent(topic)}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, topic]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#00262b] text-white z-50">
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
      <motion.h1
        className="text-4xl sm:text-6xl font-bold italic text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Let's test your <span className="text-orange-400">{topic}</span> skills!
      </motion.h1>

      <motion.p
        className="mt-6 text-xl sm:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Get ready...
      </motion.p>

      <motion.div
        className="mt-10 text-8xl font-black"
        key={countdown}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {countdown}
      </motion.div>
    </div>
  );
};

export default QuizIntro;

