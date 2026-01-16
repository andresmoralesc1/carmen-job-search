import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-6 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/25",
  secondary: "bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors",
  outline: "border border-zinc-700 text-white font-semibold hover:bg-zinc-800 transition-colors",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  showArrow = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full transition-all";
  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <Link href={href} className={combinedClasses}>
      {children}
      {showArrow && <ArrowRight className="w-5 h-5" />}
    </Link>
  );
}
