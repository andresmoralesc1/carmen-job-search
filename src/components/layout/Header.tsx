"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { CarmenLogo } from "@/components/CarmenLogo";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `
    sticky top-0 z-50 backdrop-blur-xl transition-all duration-300
    ${scrolled ? "py-2 bg-black/80 shadow-lg shadow-black/20" : "py-4 bg-black/50"}
    border-b border-zinc-800/50
  `;

  const linkClasses = (href: string) => `
    relative text-zinc-400 hover:text-white transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0
    after:h-0.5 after:bg-violet-500 after:transition-all after:duration-300
    hover:after:w-full
    ${pathname === href ? "text-white after:w-full" : ""}
  `;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative transition-all duration-300 group-hover:rotate-6">
            <CarmenLogo className="w-8 h-8" />
            <div className="absolute inset-0 bg-violet-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h1 className="text-xl font-bold text-white transition-all duration-300 group-hover:text-violet-400">Carmen Job Search</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-300 active:scale-95"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl animate-slide-down">
          <nav
            className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  transition-all duration-300 active:scale-95
                  ${pathname === link.href
                    ? "text-white bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 mt-2 active:scale-95"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
