"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dim";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("hubdash-theme");
  if (stored === "light" || stored === "dim") return stored;
  // Map system preference: dark → dim, light → light
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? "dim" : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply data attribute class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dim");
    if (theme === "dim") {
      root.classList.add("theme-dim");
    }
    window.localStorage.setItem("hubdash-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === "light" ? "dim" : "light"));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
