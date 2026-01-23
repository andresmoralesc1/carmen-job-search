"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Types and Interfaces
// ============================================

type BentoSpan = 1 | 2 | 3;
type BentoSize = "sm" | "md" | "lg" | "full";

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: BentoSpan;
  rowSpan?: BentoSpan;
  size?: BentoSize;
  highlight?: boolean;
  onClick?: () => void;
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

// ============================================
// Bento Grid Container
// ============================================

/**
 * Modern bento grid layout - inspired by Apple, Linear, and modern SaaS
 * Provides organized, magazine-like card layouts
 */
export function BentoGrid({
  children,
  className = "",
  columns = 3,
  gap = "md",
}: BentoGridProps) {
  const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses: Record<string, string> = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        "auto-rows-[200px]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// Bento Grid Item
// ============================================

/**
 * Individual bento grid item with configurable spans
 */
export function BentoItem({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  size = "md",
  highlight = false,
  onClick,
}: BentoItemProps) {
  const spanClasses = cn(
    colSpan > 1 && `md:col-span-${colSpan}`,
    rowSpan > 1 && `md:row-span-${rowSpan}`
  );

  const sizeClasses: Record<BentoSize, string> = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-2xl",
    full: "p-10 rounded-3xl",
  };

  const highlightClasses = highlight
    ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30 shadow-lg shadow-violet-500/10"
    : "bg-white/5 border-white/10";

  const hoverClasses = onClick
    ? "cursor-pointer hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
    : "";

  return (
    <div
      className={cn(
        "relative backdrop-blur-xl border overflow-hidden",
        spanClasses,
        sizeClasses[size],
        highlightClasses,
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ============================================
// Pre-configured Bento Items
// ============================================

interface BentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  iconBackground?: string;
  className?: string;
  colSpan?: BentoSpan;
  rowSpan?: BentoSpan;
  size?: BentoSize;
  highlight?: boolean;
  onClick?: () => void;
}

/**
 * Pre-configured bento card with title, description, and icon
 */
export function BentoCard({
  title,
  description,
  icon,
  iconBackground = "bg-violet-500/20",
  className = "",
  colSpan = 1,
  rowSpan = 1,
  size = "md",
  highlight = false,
  onClick,
}: BentoCardProps) {
  return (
    <BentoItem
      colSpan={colSpan}
      rowSpan={rowSpan}
      size={size}
      highlight={highlight}
      onClick={onClick}
      className={cn("group flex flex-col", className)}
    >
      {icon && (
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", iconBackground)}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed">
        {description}
      </p>
    </BentoItem>
  );
}

// ============================================
// Featured Bento Card (larger, more prominent)
// ============================================

interface FeaturedBentoCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
  gradient?: "violet" | "blue" | "green" | "orange";
  className?: string;
  onClick?: () => void;
}

const gradients = {
  violet: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  green: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  orange: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
};

export function FeaturedBentoCard({
  title,
  description,
  badge,
  icon,
  gradient = "violet",
  className = "",
  onClick,
}: FeaturedBentoCardProps) {
  return (
    <BentoItem
      colSpan={2}
      rowSpan={2}
      size="lg"
      highlight={true}
      onClick={onClick}
      className={cn(
        "bg-gradient-to-br",
        gradients[gradient],
        "group cursor-pointer"
      )}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          {badge && (
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              {badge}
            </span>
          )}
          {icon && (
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-200 transition-colors">
            {title}
          </h3>
          <p className="text-zinc-300 text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </BentoItem>
  );
}

// ============================================
// Stat Bento Card (for metrics and numbers)
// ============================================

interface StatBentoCardProps {
  value: string | number;
  label: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function StatBentoCard({
  value,
  label,
  change,
  changeType = "neutral",
  icon,
  trend = "stable",
  className = "",
}: StatBentoCardProps) {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-zinc-400",
  };

  return (
    <BentoItem size="sm" className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
      {change && (
        <div className={cn("text-sm font-medium flex items-center gap-1", changeColors[changeType])}>
          {trend === "up" && <span>↑</span>}
          {trend === "down" && <span>↓</span>}
          {change}
        </div>
      )}
    </BentoItem>
  );
}

// ============================================
// Export types
// ============================================

export type { BentoSpan, BentoSize };
