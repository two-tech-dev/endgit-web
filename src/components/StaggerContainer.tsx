"use client";

import { useInView } from "@/hooks/useInView";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.08,
  className,
  style,
}: StaggerContainerProps) {
  const { ref, inView } = useInView();

  const indexedChildren = inView
    ? Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as React.ReactElement<any>, {
          style: {
            ...(child.props.style || {}),
            animation: `fadeSlideUp 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * staggerDelay}s both`,
          },
        });
      })
    : null;

  return (
    <div ref={ref} className={className} style={style}>
      {indexedChildren}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
