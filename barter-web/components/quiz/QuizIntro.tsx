"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const QuizIntro = () => {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push("/quiz/start"); // Ścieżka do właściwego quizu
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#00262b] text-white">
      <motion.h1
        className="text-4xl sm:text-6xl font-bold italic text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Let's test your skills!
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
