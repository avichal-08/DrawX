"use client";
import { motion, Transition } from "motion/react";
import React from "react";

export const Loader: React.FC = () => {
  const transition = (x: number): Transition => ({
    duration: 1,
    repeat: Infinity,
    repeatType: "loop",
    delay: x * 0.2,
    ease: "easeInOut",
  });

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={transition(i)}
          className="h-4 w-4 rounded-full border border-orange-300 bg-gradient-to-b from-orange-400 to-orange-300"
        />
      ))}
    </div>
  );
};
