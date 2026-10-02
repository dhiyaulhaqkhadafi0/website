"use client";

import { motion, useScroll } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#ECEDE7] origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
