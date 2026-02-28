"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="
        flex h-9 w-9 items-center justify-center rounded-full
        bg-slate-900/60 dark:bg-slate-900/60
        backdrop-blur-2xl ring-1 ring-white/10
        text-slate-700 dark:text-slate-200
        hover:bg-slate-800/70 dark:hover:bg-slate-800/70
        hover:ring-white/20
        transition-all duration-300
      "
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
