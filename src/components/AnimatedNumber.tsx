"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
}

/**
 * A component that animates a numeric value from 0 to the target value.
 * If the value is non-numeric (e.g., "—"), it displays it as-is.
 */
export default function AnimatedNumber({ value, duration = 1500 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<string | number>("0");
  const countRef = useRef<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Parse numeric value, removing commas if it's a string
  const targetValue = typeof value === "string" 
    ? parseFloat(value.replace(/,/g, "")) 
    : value;
    
  const isNumeric = !isNaN(targetValue as number) && targetValue !== null && typeof targetValue === "number";

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isNumeric, value]);

  useEffect(() => {
    if (!isVisible || !isNumeric) return;

    let startTime: number | null = null;
    const endValue = targetValue as number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing: easeOutExpo (fast start, slow end)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = easeProgress * (endValue - startValue) + startValue;
      const isInt = Number.isInteger(endValue);
      
      const formatted = isInt 
        ? Math.floor(currentCount).toLocaleString()
        : currentCount.toLocaleString(undefined, { 
            minimumFractionDigits: 1, 
            maximumFractionDigits: 1 
          });

      if (formatted !== displayValue) {
        setDisplayValue(formatted);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue.toLocaleString(undefined, {
          minimumFractionDigits: isInt ? 0 : 1,
          maximumFractionDigits: isInt ? 0 : 1
        }));
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible, isNumeric, targetValue, duration, displayValue]);

  return <span ref={elementRef}>{displayValue}</span>;
}
