import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = false,
  clickable = false,
  onClick,
}: CardProps) {
  const baseClasses = "p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800";
  const hoverClasses =
    hover || clickable
      ? "hover:border-orange-500/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
      : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
