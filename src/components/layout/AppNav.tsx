"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  FileText,
  Megaphone,
  Search,
  Menu,
  X
} from "lucide-react";
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
      activeLight: "bg-hti-plum/10 text-hti-plum border-hti-plum/30 shadow-sm",
      activeDark: "bg-hti-fig/40 text-hti-soleil border-white/10 shadow-md",
    },
    {
      href: "/ops",
      label: "Operations",
      icon: Zap,
      activeLight: "bg-hti-ember/10 text-hti-ember border-hti-ember/30 shadow-sm",
      activeDark: "bg-hti-ember/20 text-hti-soleil border-hti-ember/40 shadow-md",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: FileText,
      activeLight: "bg-hti-gold/10 text-hti-fig border-hti-gold/40 shadow-sm",
      activeDark: "bg-hti-gold/20 text-hti-midnight border-hti-gold/40 shadow-md",
    },
    {
      href: "/marketing",
      label: "Marketing",
      icon: Megaphone,
      activeLight: "bg-hti-sunset/10 text-hti-sunset border-hti-sunset/30 shadow-sm",
      activeDark: "bg-hti-sunset/20 text-hti-soleil border-hti-sunset/40 shadow-md",
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);
  const isHome = pathname === "/";
  const isDarkTheme = pathname?.startsWith("/ops"); // Ops page uses dark theme

  // Don't show nav on home page
  if (isHome) return null;

  return (
    <>
      {/* Desktop Navigation - Theme Aware */}
      <nav className={`sticky top-0 z-50 backdrop-blur-sm shadow-sm ${
        isDarkTheme
          ? 'bg-hti-midnight/95 border-b border-white/10'
          : 'bg-white/95 border-b border-hti-fig/10'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-hti-plum via-hti-fig to-hti-dusk rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                HTI
              </div>
              <span className={`font-bold text-lg hidden sm:inline ${
                isDarkTheme ? 'text-hti-sand' : 'text-hti-plum'
              }`}>HubDash</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                      active
                        ? (isDarkTheme ? item.activeDark : item.activeLight)
                        : isDarkTheme
                          ? "border-transparent text-hti-sand/80 hover:bg-white/5 hover:text-hti-sand"
                          : "border-transparent text-hti-stone hover:bg-hti-sand/60 hover:text-hti-plum"
                    }`}
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
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'text-hti-sand/80 hover:bg-white/10 hover:text-hti-sand'
                    : 'text-hti-stone/80 hover:bg-hti-sand/70 hover:text-hti-plum'
                }`}
                aria-label="Global search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'text-hti-sand/80 hover:bg-white/10 hover:text-hti-sand'
                    : 'text-hti-stone/80 hover:bg-hti-sand/70 hover:text-hti-plum'
                }`}
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
                  className={`w-full px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkTheme
                      ? 'bg-hti-midnight border border-white/15 text-hti-sand placeholder-hti-mist/70 focus:ring-hti-gold/30'
                      : 'bg-white border border-hti-fig/15 text-hti-stone placeholder-hti-mist/80 focus:ring-hti-plum/30'
                  }`}
                  autoFocus
                />
                <Search className="w-5 h-5 text-hti-mist absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-hti-mist hover:text-hti-plum"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className={`mt-2 rounded-lg shadow-lg p-2 ${
                  isDarkTheme
                    ? 'bg-hti-midnight border border-white/10'
                    : 'bg-white border border-hti-fig/10'
                }`}>
                  <div className={`text-sm p-2 ${isDarkTheme ? 'text-hti-sand/80' : 'text-hti-stone/80'}`}>
                    Press Enter to search across all data...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 ${
            isDarkTheme
              ? 'border-t border-white/10 bg-hti-midnight'
              : 'border-t border-hti-fig/10 bg-white'
          }`}>
            <div className="px-4 pt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all border ${
                      active
                        ? (isDarkTheme ? item.activeDark : item.activeLight)
                        : isDarkTheme
                          ? "border-transparent text-hti-sand/80 hover:bg-white/5 hover:text-hti-sand"
                          : "border-transparent text-hti-stone hover:bg-hti-sand/60 hover:text-hti-plum"
                    }`}
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
      <div className={isDarkTheme ? 'bg-hti-midnight/85 border-b border-white/10' : 'bg-hti-sand/60 border-b border-hti-fig/10'}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className={`flex items-center gap-2 text-sm ${isDarkTheme ? 'text-hti-sand/70' : 'text-hti-stone/80'}`}>
            <Link href="/" className={isDarkTheme ? 'hover:text-hti-gold' : 'hover:text-hti-plum'}>
              Home
            </Link>
            <span>/</span>
            <span className={isDarkTheme ? 'text-hti-sand font-semibold' : 'text-hti-plum font-semibold'}>
              {navItems.find(item => isActive(item.href))?.label || "Dashboard"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
