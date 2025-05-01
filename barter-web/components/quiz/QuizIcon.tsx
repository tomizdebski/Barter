
"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { CustomTooltip } from "../CustomTooltip";

const QuizIcon: React.FC = () => {
  return (
    <>
      <CustomTooltip id="quiz-tooltip" content="Take a quiz to test your knowledge!" />

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



