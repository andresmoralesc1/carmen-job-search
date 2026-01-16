"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  id?: string;
}

export function LazySection({
  children,
  className = "",
  threshold = 0.1,
  id,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} id={id} className={className}>
      {isVisible ? children : null}
    </div>
  );
}
