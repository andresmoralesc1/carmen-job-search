import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "px-6 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

// Variantes actualizadas para coincidir con Button.tsx
const variantClasses = {
  primary: "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  secondary: "bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  outline: "border border-violet-500/30 text-white font-semibold hover:bg-violet-500/10 hover:border-violet-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
  ghost: "text-zinc-300 hover:text-white hover:bg-violet-500/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
};

export function LoadingButton({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
      <span className={loading ? "opacity-70" : ""}>{children}</span>
    </button>
  );
}
