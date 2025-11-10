"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDim = theme === "dim";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-default bg-surface text-secondary hover:text-primary hover:border-strong transition-all ${className}`}
      title={isDim ? "Switch to Light" : "Switch to Dim"}
    >
      {isDim ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">{isDim ? "Light" : "Dim"}</span>
    </button>
  );
}
