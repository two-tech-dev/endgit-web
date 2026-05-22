"use client";

import { useInView } from "@/hooks/useInView";
import { useEffect, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const directionStyles = {
  up: (d: number) => ({ transform: `translateY(${d}px)` }),
  down: (d: number) => ({ transform: `translateY(-${d}px)` }),
  left: (d: number) => ({ transform: `translateX(${d}px)` }),
  right: (d: number) => ({ transform: `translateX(-${d}px)` }),
  none: () => ({ transform: "scale(0.97)" }),
};

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.5,
  className,
  style,
}: FadeInProps) {
  const { ref, inView } = useInView();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  const initialTransform = directionStyles[direction](distance);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : initialTransform.transform,
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
