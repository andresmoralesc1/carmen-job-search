"use client";

import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Types and Interfaces
// ============================================

type GlassVariant = "default" | "subtle" | "dark" | "colored";
type GlassSize = "sm" | "md" | "lg" | "xl";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: GlassVariant;
  size?: GlassSize;
  hover?: boolean;
  glow?: boolean;
  border?: boolean;
  gradient?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

// ============================================
// Glassmorphism Card Component
// ============================================

/**
 * Modern glassmorphism card with blur, transparency, and depth
 * Inspired by Apple, Microsoft, and modern SaaS designs
 */
export function GlassCard({
  children,
  className = "",
  variant = "default",
  size = "md",
  hover = true,
  glow = false,
  border = true,
  gradient = false,
  style,
  onClick,
}: GlassCardProps) {
  const baseClasses = "relative overflow-hidden backdrop-blur-xl transition-all duration-500";

  // Variant styles
  const variantClasses: Record<GlassVariant, string> = {
    default: "bg-white/5 border border-white/10",
    subtle: "bg-white/[0.02] border border-white/5",
    dark: "bg-black/40 border border-white/5",
    colored: "bg-violet-500/10 border border-violet-500/20",
  };

  // Size styles (padding)
  const sizeClasses: Record<GlassSize, string> = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl",
    xl: "p-10 rounded-3xl",
  };

  // Hover effects
  const hoverClasses = hover
    ? "hover:bg-white/8 hover:border-white/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10"
    : "";

  // Glow effect
  const glowClasses = glow ? "shadow-lg shadow-violet-500/20" : "";

  // Gradient overlay
  const gradientOverlay = gradient ? (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10 pointer-events-none" />
  ) : null;

  // Shine effect on hover
  const shineEffect = hover ? (
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  ) : null;

  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses,
    glowClasses,
    onClick ? "cursor-pointer active:scale-[0.98]" : "",
    className
  );

  return (
    <div
      className={combinedClasses}
      style={style}
      onClick={onClick}
    >
      {gradientOverlay}
      {shineEffect}
      {children}
    </div>
  );
}

// ============================================
// Glass Button Component
// ============================================

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Glassmorphism button with modern effects
 */
export function GlassButton({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "md",
  glow = false,
  disabled = false,
  type = "button",
}: GlassButtonProps) {
  const baseClasses = "relative overflow-hidden backdrop-blur-xl rounded-full font-medium transition-all duration-300";

  // Variant styles
  const variantClasses: Record<string, string> = {
    default: "bg-white/10 border border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-white/10",
    primary: "bg-gradient-to-r from-violet-500 to-purple-500 border border-violet-400/30 text-white hover:from-violet-600 hover:to-purple-600 hover:shadow-lg hover:shadow-violet-500/30",
    secondary: "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
  };

  // Size styles
  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Glow effect
  const glowClasses = glow ? "shadow-lg shadow-violet-500/20" : "";

  // Shimmer effect
  const shimmer = (
    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );

  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    glowClasses,
    disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95",
    "group",
    className
  );

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {shimmer}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

// ============================================
// Glass Badge Component
// ============================================

interface GlassBadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Small glassmorphism badge for labels and tags
 */
export function GlassBadge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: GlassBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1.5 backdrop-blur-md rounded-full border";

  const variantClasses: Record<string, string> = {
    default: "bg-white/10 border-white/20 text-white",
    success: "bg-green-500/20 border-green-500/30 text-green-400",
    warning: "bg-amber-500/20 border-amber-500/30 text-amber-400",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </span>
  );
}

// ============================================
// Glass Input Component
// ============================================

interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  variant?: "default" | "subtle";
}

/**
 * Glassmorphism input field
 */
export function GlassInput({
  label,
  error,
  helperText,
  icon,
  variant = "default",
  className = "",
  ...props
}: GlassInputProps) {
  const baseClasses = "w-full backdrop-blur-xl rounded-xl border transition-all duration-300";

  const variantClasses: Record<string, string> = {
    default: "bg-white/5 border-white/10 focus:border-violet-500/50 focus:bg-white/10",
    subtle: "bg-white/[0.02] border-white/5 focus:border-violet-500/30 focus:bg-white/5",
  };

  const errorClasses = error ? "border-red-500/50 focus:border-red-500" : "";

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            errorClasses,
            icon ? "pl-12" : "px-4",
            "py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20",
            className
          )}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-zinc-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ============================================
// Glass Divider Component
// ============================================

interface GlassDividerProps {
  variant?: "default" | "subtle";
  thickness?: "thin" | "medium";
  className?: string;
}

/**
 * Decorative glassmorphism divider
 */
export function GlassDivider({
  variant = "default",
  thickness = "thin",
  className = "",
}: GlassDividerProps) {
  const thicknessClasses: Record<string, string> = {
    thin: "h-px",
    medium: "h-0.5",
  };

  const variantClasses: Record<string, string> = {
    default: "bg-gradient-to-r from-transparent via-white/10 to-transparent",
    subtle: "bg-white/5",
  };

  return (
    <div className={cn("w-full", thicknessClasses[thickness], variantClasses[variant], className)} />
  );
}

// ============================================
// Export all components
// ============================================

export {
  type GlassVariant,
  type GlassSize,
};
