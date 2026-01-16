"use client";

import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  distance?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(-${distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(-${distance}px)`;
      case "fade":
        return "none";
      case "scale":
        return "scale(0.9)";
      default:
        return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`.trim()}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0) scale(1)" : getTransform(),
      }}
    >
      {children}
    </div>
  );
}

interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
}

export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
}: StaggerRevealProps) {
  return (
    <>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          className={className}
        >
          {child}
        </ScrollReveal>
      ))}
    </>
  );
}

// Preset animation combinations
export const animations = {
  fadeIn: { direction: "fade" as const },
  slideUp: { direction: "up" as const },
  slideDown: { direction: "down" as const },
  slideLeft: { direction: "left" as const },
  slideRight: { direction: "right" as const },
  scaleUp: { direction: "scale" as const },
};
