"use client";

import { useEffect, useState } from "react";

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: string;
  position?: "top" | "bottom";
}

export function ScrollProgress({
  className = "",
  color = "bg-orange-500",
  height = "h-1",
  position = "top",
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-[100] ${position === "top" ? "top-0" : "bottom-0"} ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`${height} ${color} transition-all duration-150 ease-out origin-left`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
