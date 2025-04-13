
"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";

const QuizIcon: React.FC = () => {
  return (
    <>
      <Tooltip
        id="quiz-tooltip"
        place="top"
        content="Put your skills to the test!"
        className="text-sm bg-[#00262b] text-white px-2 py-1 rounded shadow-md z-50"
      />

      <motion.div
        data-tooltip-id="quiz-tooltip"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="cursor-pointer flex items-center justify-center"
      >
        <HelpCircle size={20} className="text-[#00262b] animate-pulse group-hover:text-[#d64000]" />
      </motion.div>
    </>
  );
};

export default QuizIcon;



