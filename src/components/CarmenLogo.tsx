/**
 * Carmen Job Search Logo Component
 * Uses the official logo with enhanced animations
 */

import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "small" | "default" | "large" | "xl";
  withGlow?: boolean;
  animated?: boolean;
}

const sizes = {
  small: { width: 40, height: 40 },
  default: { width: 56, height: 56 },
  large: { width: 80, height: 80 },
  xl: { width: 120, height: 120 },
};

const sizeClasses = {
  small: "w-10 h-10",
  default: "w-14 h-14",
  large: "w-20 h-20",
  xl: "w-30 h-30",
};

export function CarmenLogo({
  className = "",
  size = "default",
  withGlow = false,
  animated = true,
}: LogoProps) {
  const sizeClass = sizeClasses[size];
  const { width, height } = sizes[size];

  return (
    <div className={`relative inline-block ${animated ? "group" : ""}`}>
      <Image
        src="/logo.png"
        alt="Carmen Job Search"
        width={width}
        height={height}
        className={`${sizeClass} ${className} ${animated ? "transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" : ""}`}
        style={{ borderRadius: '12px' }}
      />
      {withGlow && (
        <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </div>
  );
}

interface LogoWithTextProps {
  className?: string;
  size?: "small" | "default" | "large";
  showTagline?: boolean;
  animated?: boolean;
}

export function CarmenLogoWithText({
  className = "",
  size = "default",
  showTagline = false,
  animated = true,
}: LogoWithTextProps) {
  return (
    <div className={`flex items-center gap-4 ${className} ${animated ? "group" : ""}`}>
      <CarmenLogo size={size} withGlow={animated} animated={animated} />
      <div className="flex flex-col">
        <span className={`font-bold text-white transition-colors duration-300 ${animated ? "group-hover:text-violet-400" : ""} ${size === "large" ? "text-3xl" : "text-2xl"}`}>
          Carmen Job Search
        </span>
        {showTagline && (
          <span className="text-sm text-zinc-500">
            AI-Powered Job Search
          </span>
        )}
      </div>
    </div>
  );
}

// Loading version with animation
export function CarmenLogoLoading({
  className = "",
  size = "large",
}: { className?: string; size?: "default" | "large" | "xl" }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div className={`animate-pulse ${sizeClasses[size] || sizeClasses.large}`}>
          <Image
            src="/logo.png"
            alt="Carmen Job Search"
            width={sizes[size]?.width || 80}
            height={sizes[size]?.height || 80}
            className="w-full h-full"
            style={{ borderRadius: '12px' }}
          />
        </div>
        <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-xl animate-pulse-glow" />
      </div>
      <p className="text-sm text-zinc-500 animate-pulse">Loading...</p>
    </div>
  );
}

// Inline compact version for headers
export function CarmenLogoInline({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CarmenLogo size="small" />
      <span className="font-semibold text-white text-lg">Carmen</span>
    </div>
  );
}
