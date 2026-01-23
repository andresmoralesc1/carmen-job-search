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
  small: { width: 24, height: 24 },
  default: { width: 32, height: 32 },
  large: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

const sizeClasses = {
  small: "w-6 h-6",
  default: "w-8 h-8",
  large: "w-12 h-12",
  xl: "w-16 h-16",
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
        style={{ borderRadius: '8px' }}
      />
      {withGlow && (
        <div className="absolute inset-0 bg-violet-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
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
    <div className={`flex items-center gap-3 ${className} ${animated ? "group" : ""}`}>
      <CarmenLogo size={size} withGlow={animated} animated={animated} />
      <div className="flex flex-col">
        <span className={`font-bold text-white transition-colors duration-300 ${animated ? "group-hover:text-violet-400" : ""} ${size === "large" ? "text-2xl" : "text-xl"}`}>
          Carmen Job Search
        </span>
        {showTagline && (
          <span className="text-xs text-zinc-500">
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
            width={sizes[size]?.width || 64}
            height={sizes[size]?.height || 64}
            className="w-full h-full"
            style={{ borderRadius: '8px' }}
          />
        </div>
        <div className="absolute inset-0 bg-violet-500/20 rounded-lg blur-xl animate-pulse-glow" />
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
      <span className="font-semibold text-white">Carmen</span>
    </div>
  );
}
