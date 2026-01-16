import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: "px-6 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses = {
  primary: "bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
  secondary: "bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  outline: "border border-zinc-700 text-white font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
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
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full transition-all";
  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}
