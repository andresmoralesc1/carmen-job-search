"use client";

import { ReactNode, CSSProperties } from "react";
import { Loader2 } from "lucide-react";

// ============================================
// Types and Interfaces
// ============================================

export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoadingColor = "primary" | "white" | "zinc" | "orange";
export type LoadingVariant = "spinner" | "dots" | "pulse" | "bar" | "skeleton";

interface LoadingBaseProps {
  size?: LoadingSize;
  color?: LoadingColor;
  className?: string;
  "aria-label"?: string;
}

// ============================================
// Size and Color Mappings
// ============================================

const sizeClasses: Record<LoadingSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses: Record<LoadingColor, string> = {
  primary: "text-violet-500",
  white: "text-white",
  zinc: "text-zinc-500",
  orange: "text-orange-500",
};

const barColorClasses: Record<LoadingColor, string> = {
  primary: "bg-violet-500",
  white: "bg-white",
  zinc: "bg-zinc-500",
  orange: "bg-orange-500",
};

// ============================================
// Spinner Component
// ============================================

interface SpinnerProps extends LoadingBaseProps {
  variant?: "default" | "pulse";
}

export function Spinner({
  size = "md",
  color = "primary",
  variant = "default",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: SpinnerProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  if (variant === "pulse") {
    return (
      <div
        className={`${sizeClass} rounded-full ${colorClass} animate-pulse`}
        aria-label={ariaLabel}
        aria-live="polite"
      />
    );
  }

  return (
    <Loader2
      className={`${sizeClass} ${colorClass} animate-spin ${className}`.trim()}
      aria-label={ariaLabel}
      aria-hidden="true"
    />
  );
}

// ============================================
// Dots Loader Component
// ============================================

interface DotsLoaderProps extends LoadingBaseProps {
  dotCount?: 3 | 4;
}

export function DotsLoader({
  size = "md",
  color = "primary",
  dotCount = 3,
  className = "",
  "aria-label": ariaLabel = "Loading",
}: DotsLoaderProps) {
  const sizeMap: Record<LoadingSize, string> = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const colorClass = colorClasses[color];
  const dotSize = sizeMap[size];

  return (
    <div
      className={`flex items-center gap-1 ${className}`.trim()}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <div
          key={i}
          className={`${dotSize} rounded-full ${colorClass} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ============================================
// Pulse Loader Component
// ============================================

interface PulseLoaderProps extends LoadingBaseProps {
  variant?: "ring" | "dot";
}

export function PulseLoader({
  size = "md",
  color = "primary",
  variant = "ring",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: PulseLoaderProps) {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];
  const barColor = barColorClasses[color];

  if (variant === "dot") {
    return (
      <div
        className={`${sizeClass} rounded-full ${barColor} animate-pulse`}
        aria-label={ariaLabel}
        aria-live="polite"
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full border-2 border-t-transparent ${colorClass} animate-spin`}
      aria-label={ariaLabel}
      aria-live="polite"
    />
  );
}

// ============================================
// Progress Bar Component
// ============================================

interface ProgressBarProps {
  progress: number; // 0-100
  color?: LoadingColor;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function ProgressBar({
  progress,
  color = "primary",
  size = "md",
  showLabel = false,
  className = "",
  "aria-label": ariaLabel = "Loading progress",
}: ProgressBarProps) {
  const heightMap = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const barColor = barColorClasses[color];
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-xs text-zinc-500">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      <div className={`w-full rounded-full bg-zinc-800 overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${barColor} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// Centered Loading Component
// ============================================

interface CenteredLoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: LoadingColor;
  message?: string;
  className?: string;
  fullscreen?: boolean;
}

export function CenteredLoading({
  variant = "spinner",
  size = "lg",
  color = "primary",
  message,
  className = "",
  fullscreen = false,
}: CenteredLoadingProps) {
  const containerClass = fullscreen
    ? "fixed inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-[1080]"
    : "flex items-center justify-center py-12";

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <DotsLoader size={size} color={color} />;
      case "pulse":
        return <PulseLoader size={size} color={color} />;
      case "bar":
        return (
          <div className="w-48">
            <ProgressBar
              progress={66}
              color={color}
              showLabel={false}
              aria-label="Loading"
            />
          </div>
        );
      default:
        return <Spinner size={size} color={color} />;
    }
  };

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      <div className="flex flex-col items-center gap-4">
        {renderLoader()}
        {message && (
          <p className="text-sm text-zinc-400 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Full Screen Loading Component
// ============================================

interface FullScreenLoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: LoadingColor;
  message?: string;
  showLogo?: boolean;
}

export function FullScreenLoading({
  variant = "spinner",
  size = "xl",
  color = "primary",
  message,
  showLogo = false,
}: FullScreenLoadingProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md z-[1080]">
      {showLogo && (
        <div className="mb-8 animate-float">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      )}
      <CenteredLoading
        variant={variant}
        size={size}
        color={color}
        message={message}
      />
    </div>
  );
}

// ============================================
// Inline Loading Component (for buttons, etc)
// ============================================

interface InlineLoadingProps extends LoadingBaseProps {
  variant?: "spinner" | "dots";
  text?: string;
}

export function InlineLoading({
  variant = "spinner",
  size = "sm",
  color = "white",
  text,
  className = "",
}: InlineLoadingProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      {variant === "dots" ? (
        <DotsLoader size={size} color={color} aria-label="Loading" />
      ) : (
        <Spinner size={size} color={color} aria-label="Loading" />
      )}
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}

// ============================================
// Skeleton Card (enhanced version)
// ============================================

interface SkeletonCardProps {
  showIcon?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  showIcon = true,
  lines = 3,
  className = "",
}: SkeletonCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 ${className}`.trim()}
      aria-hidden="true"
    >
      {showIcon && (
        <div className="w-12 h-12 rounded-xl mb-4 bg-zinc-800 animate-pulse" />
      )}
      <div className="w-3/4 h-6 rounded bg-zinc-800 animate-pulse mb-3" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-zinc-800 animate-pulse`}
            style={{ width: i === lines - 1 ? "80%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Table Skeleton Component
// ============================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`.trim()} aria-hidden="true">
      {/* Header */}
      <div className="flex gap-4 mb-4 pb-2 border-b border-zinc-800">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-6 rounded bg-zinc-800 animate-pulse" style={{ width: `${100 / columns}%` }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-10 rounded bg-zinc-800/50 animate-pulse"
              style={{ width: `${100 / columns}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================
// List Skeleton Component
// ============================================

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

export function ListSkeleton({
  items = 5,
  showAvatar = true,
  className = "",
}: ListSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/30">
          {showAvatar && (
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 rounded bg-zinc-800 animate-pulse" />
            <div className="w-1/2 h-3 rounded bg-zinc-800/50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Stats Skeleton Component
// ============================================

interface StatsGridSkeletonProps {
  count?: number;
  className?: string;
}

export function StatsGridSkeleton({
  count = 4,
  className = "",
}: StatsGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 animate-pulse mb-4" />
          <div className="w-1/2 h-4 rounded bg-zinc-800 animate-pulse mb-2" />
          <div className="w-3/4 h-8 rounded bg-zinc-800 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// Card Grid Skeleton Component
// ============================================

interface CardGridSkeletonProps {
  cards?: number;
  className?: string;
}

export function CardGridSkeleton({
  cards = 6,
  className = "",
}: CardGridSkeletonProps) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} showIcon={false} lines={2} />
      ))}
    </div>
  );
}

// Export default
export default Spinner;

// ============================================
// Logo Loading Component (with brand logo)
// ============================================

interface LogoLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Loading component with Carmen logo animation
 */
export function LogoLoading({
  message = "Loading...",
  size = "md",
  className = "",
}: LogoLoadingProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`.trim()}>
      <div className="relative">
        <div className={`${sizeMap[size]} relative`}>
          <img
            src="/logo.png"
            alt="Carmen Job Search"
            className={`w-full h-full ${size === "lg" ? "animate-bounce-subtle" : "animate-pulse"}`}
            style={{ borderRadius: '8px' }}
          />
        </div>
        {/* Rotating glow ring */}
        <div className={`absolute inset-0 rounded-lg ${size === "lg" ? "animate-spin-slow" : ""}`}>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-30 blur-lg animate-pulse" />
        </div>
      </div>
      {message && (
        <p className="text-sm text-zinc-400 animate-pulse flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          {message}
        </p>
      )}
    </div>
  );
}

// ============================================
// Branded Full Screen Loading
// ============================================

interface BrandedFullScreenLoadingProps {
  message?: string;
}

/**
 * Full screen loading with logo and branding
 */
export function BrandedFullScreenLoading({
  message = "Preparing your dashboard...",
}: BrandedFullScreenLoadingProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 z-[1080]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 relative">
            <img
              src="/logo.png"
              alt="Carmen Job Search"
              className="w-full h-full animate-float"
              style={{ borderRadius: '8px' }}
            />
          </div>
          {/* Glow effects */}
          <div className="absolute inset-0 bg-violet-500/30 rounded-2xl blur-2xl animate-pulse-glow" />
          <div className="absolute inset-0 rounded-2xl border border-violet-500/20 animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">Carmen Job Search</h2>
          <p className="text-sm text-zinc-500">AI-Powered Job Discovery</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          {message && (
            <p className="text-sm text-zinc-400 animate-pulse">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
