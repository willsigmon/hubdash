"use client";

import { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useAppStore, useIsDark } from '@/lib/stores/app-store';
import { Button } from './Button';

/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */
export default function ThemeToggle() {
  const { theme, setTheme, setSystemTheme } = useAppStore();
  const isDark = useIsDark();

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('light')}
        aria-label="Switch to light theme"
        className="p-2"
      >
        <Sun className="w-4 h-4" />
      </Button>

      <Button
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('dark')}
        aria-label="Switch to dark theme"
        className="p-2"
      >
        <Moon className="w-4 h-4" />
      </Button>

      <Button
        variant={theme === 'system' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('system')}
        aria-label="Use system theme"
        className="p-2"
      >
        <Monitor className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Compact version for navigation bars
export function ThemeToggleCompact() {
  const { theme, setTheme } = useAppStore();
  const isDark = useIsDark();

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      className="p-2"
    >
      {getIcon()}
    </Button>
  );
}
