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

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
  secondary: "bg-zinc-800 text-white font-semibold hover:bg-zinc-700",
  outline: "border border-zinc-700 text-white font-semibold hover:bg-zinc-800 hover:border-zinc-600",
  ghost: "text-zinc-300 hover:text-white hover:bg-zinc-800/50",
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

    if (ripple) {
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

  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full transition-all relative overflow-hidden";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClasses = isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "";
  const activeClasses = !isDisabled ? "active:scale-95 active:opacity-90" : "";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClasses} ${activeClasses} ${className}`.trim();

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
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-green-400" />}
      <span className="relative z-10">{children}</span>
      {showArrow && !isLoading && !isSuccess && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
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
    <button onClick={handleClick} className={combinedClasses} disabled={isDisabled}>
      {content}
    </button>
  );
}
