"use client";

import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { ReactNode, useState } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonState = "default" | "loading" | "success";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
  state?: ButtonState;
  onClick?: () => void;
  disabled?: boolean;
  ripple?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-6 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

// Variantes actualizadas con hover:scale-105 consistente
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  secondary: "bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  outline: "border border-violet-500/30 text-white font-semibold hover:bg-violet-500/10 hover:border-violet-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  ghost: "text-zinc-300 hover:text-white hover:bg-violet-500/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  showArrow = false,
  className = "",
  fullWidth = false,
  loading = false,
  state = "default",
  onClick,
  disabled = false,
  ripple = true,
}: ButtonProps) {
  const [rippleCoords, setRippleCoords] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading || state === "loading") return;

    if (ripple && variant !== "ghost") {
      const rect = e.currentTarget.getBoundingClientRect();
      setRippleCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setRippleCoords(null), 600);
    }

    onClick?.();
  };

  const isDisabled = disabled || loading || state === "loading";
  const isLoading = loading || state === "loading";
  const isSuccess = state === "success";

  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
  const widthClass = fullWidth ? "w-full" : "";

  // Removimos pointer-events-none para permitir focus en elementos deshabilitados para accesibilidad
  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClasses} ${className}`.trim();

  const content = (
    <>
      {rippleCoords && (
        <span
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: rippleCoords.x,
            top: rippleCoords.y,
            width: "100px",
            height: "100px",
            marginLeft: "-50px",
            marginTop: "-50px",
          }}
        />
      )}
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-green-400" aria-hidden="true" />}
      <span className="relative z-10">{children}</span>
      {showArrow && !isLoading && !isSuccess && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={combinedClasses} disabled={isDisabled} aria-busy={isLoading}>
      {content}
    </button>
  );
}
