import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`max-w-7xl mx-auto px-6 py-16 ${className}`}>
      {children}
    </section>
  );
}
