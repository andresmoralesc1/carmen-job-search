"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5 text-zinc-400" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-zinc-400" />
      ) : (
        <Sun className="w-5 h-5 text-orange-500" />
      )}
    </button>
  );
}
