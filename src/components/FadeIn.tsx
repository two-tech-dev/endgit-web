"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const directionMap = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 },
};

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.5,
  className,
  style,
}: FadeInProps) {
  const offset = directionMap[direction];
  const scale = direction === "none" ? 0.97 : 1;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x !== 0 ? (offset.x > 0 ? distance : -distance) : 0,
        y: offset.y !== 0 ? (offset.y > 0 ? distance : -distance) : 0,
        scale,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
