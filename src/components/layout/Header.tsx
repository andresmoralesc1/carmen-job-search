"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { CarmenLogo } from "@/components/CarmenLogo";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
    ${scrolled ? "py-3 bg-black/90 shadow-lg shadow-violet-500/10" : "py-5 bg-black/70"}
    border-b border-zinc-800/50
  `;

  const linkClasses = (href: string) => {
    const isActive = pathname === href;
    const isHovered = hoveredLink === href;

    return `
      relative px-4 py-2 rounded-lg transition-all duration-300
      ${isActive
        ? "text-white bg-violet-500/10"
        : "text-zinc-400 hover:text-white hover:bg-violet-500/5"
      }
      ${isHovered && !isActive ? "scale-105" : ""}
      group overflow-hidden
    `;
  };

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative">
            <CarmenLogo size="default" withGlow animated />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white transition-all duration-300 group-hover:text-violet-400">
              Carmen Job Search
            </h1>
            <span className="text-[10px] text-zinc-500 group-hover:text-violet-300 transition-colors">
              AI-Powered
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-2"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href} role="none">
                <Link
                  href={link.href}
                  className={linkClasses(link.href)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    {pathname === link.href && (
                      <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                    )}
                  </span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-violet-500/20 rounded-lg animate-pulse" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2.5 text-zinc-400 hover:text-white hover:bg-violet-500/10 rounded-lg transition-all duration-300 active:scale-95 border border-transparent hover:border-violet-500/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl animate-slide-down">
          <nav
            className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href} role="none">
                  <Link
                    href={link.href}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg
                      transition-all duration-300 active:scale-95 group
                      ${pathname === link.href
                        ? "text-white bg-violet-500/10 border border-violet-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-violet-500/5 hover:border hover:border-violet-500/10"
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    <span className="flex items-center gap-3">
                      {pathname === link.href && (
                        <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                      )}
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 mt-3 active:scale-95 shadow-lg shadow-violet-500/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
