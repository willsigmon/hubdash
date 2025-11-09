"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import HTILogo from "@/components/ui/HTILogo";
import {
    FileText,
    LayoutDashboard,
    Megaphone,
    Menu,
    Moon,
    Search,
    Sun,
    X,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AppNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    {
      href: "/board",
      label: "Board",
      icon: LayoutDashboard,
      // legacy style keys removed in favor of semantic tokens
    },
    {
      href: "/ops",
      label: "Operations",
      icon: Zap,
      // legacy style keys removed in favor of semantic tokens
    },
    {
      href: "/reports",
      label: "Reports",
      icon: FileText,
      // legacy style keys removed in favor of semantic tokens
    },
    {
      href: "/marketing",
      label: "Marketing",
      icon: Megaphone,
      // legacy style keys removed in favor of semantic tokens
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);
  const isHome = pathname === "/";
  // Consume actual theme from context instead of route heuristic
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === "dim";

  // Don't show nav on home page
  if (isHome) return null;

  return (
    <>
      {/* Desktop Navigation - Theme Aware */}
      <nav className={`sticky top-0 z-50 backdrop-blur-sm shadow-sm bg-surface/95 border-b border-default`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-100 transition-opacity">
              <HTILogo size="sm" showText={false} />
              <span className={`font-black text-xl hidden sm:inline text-primary tracking-tight`} style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
                fontWeight: 800
              }}>HUBDash</span>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${active ? 'bg-soft-accent text-accent border-accent shadow-sm' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'} `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition-colors text-secondary hover:text-primary hover:bg-surface-hover"
                aria-label="Global search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg transition-colors text-secondary hover:text-primary hover:bg-surface-hover"
              >
                {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors text-secondary hover:text-primary hover:bg-surface-hover"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {searchOpen && (
            <div className="pb-4 animate-fadeIn">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search devices, donations, partners, quotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 bg-surface-alt border border-default text-primary placeholder:text-muted focus:ring-accent/30"
                  autoFocus
                />
                <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 rounded-lg shadow-lg p-2 bg-surface-alt border border-default">
                  <div className="text-sm p-2 text-secondary">
                    Press Enter to search across all data...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-default bg-surface">
            <div className="px-4 pt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all border ${active ? 'bg-soft-accent text-accent border-accent shadow-sm' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Breadcrumb Trail - Theme Aware */}
      <div className="bg-surface-alt/85 border-b border-default">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">
              {navItems.find(item => isActive(item.href))?.label || "Dashboard"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
