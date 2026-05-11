"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
}

/**
 * A component that animates a numeric value from 0 to the target value.
 * If the value is non-numeric (e.g., "—"), it displays it as-is.
 */
export default function AnimatedNumber({
  value,
  duration = 1500,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // Parse numeric value, removing commas if it's a string
  const targetValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  const isNumeric = typeof targetValue === "number" && !isNaN(targetValue);
  const isInt = isNumeric && Number.isInteger(targetValue);

  const formatValue = useCallback(
    (n: number) => {
      if (isInt) return Math.floor(n).toLocaleString();
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    },
    [isInt],
  );

  const formatFinal = useCallback(
    (n: number) => {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: isInt ? 0 : 1,
        maximumFractionDigits: isInt ? 0 : 1,
      });
    },
    [isInt],
  );

  useEffect(() => {
    // Non-numeric: show as-is immediately
    if (!isNumeric) {
      setDisplayValue(String(value));
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();

    function runAnimation() {
      const endValue = targetValue as number;
      let startTime: number | null = null;
      let rafId: number;

      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = ease * endValue;

        setDisplayValue(formatValue(current));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplayValue(formatFinal(endValue));
        }
      };

      rafId = requestAnimationFrame(tick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isNumeric, duration, formatValue, formatFinal, targetValue]);

  return <span ref={elementRef}>{displayValue}</span>;
}
