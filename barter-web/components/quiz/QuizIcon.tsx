
'use client';

import { motion } from "framer-motion";
import { CustomTooltip } from "../CustomTooltip";

const QuizIcon: React.FC = () => {
  return (
    <>
      <CustomTooltip
        id="quiz-tooltip"
        content="🎯 Ready? Take a quiz and test your skills!"
      />

      <motion.div
        data-tooltip-id="quiz-tooltip"
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="cursor-pointer text-[14px] font-semi-bold text-[#00262b]  hover:text-[#d64000] "
      >
        Quiz 
      </motion.div>
    </>
  );
};

export default QuizIcon;



