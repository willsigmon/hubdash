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
    { href: "/board", label: "Board", icon: LayoutDashboard, color: "hti-navy" },
    { href: "/ops", label: "Operations", icon: Zap, color: "hti-red" },
    { href: "/reports", label: "Reports", icon: FileText, color: "hti-teal" },
    { href: "/marketing", label: "Marketing", icon: Megaphone, color: "pink-600" },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);
  const isHome = pathname === "/";
  const isDarkTheme = pathname?.startsWith("/ops"); // Ops page uses dark theme

  // Don't show nav on home page
  if (isHome) return null;

  return (
    <>
      {/* Desktop Navigation - Theme Aware */}
      <nav className={`sticky top-0 z-50 shadow-sm ${
        isDarkTheme
          ? 'bg-gray-900 border-b border-gray-700'
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-hti-navy to-hti-teal rounded-lg flex items-center justify-center text-white font-bold text-sm">
                HTI
              </div>
              <span className={`font-bold text-lg hidden sm:inline ${
                isDarkTheme ? 'text-white' : 'text-hti-navy'
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      active
                        ? isDarkTheme
                          ? 'bg-hti-teal/20 text-hti-teal-light border border-hti-teal/40'
                          : item.href === '/board'
                          ? 'bg-blue-900/10 text-hti-navy border border-hti-navy/20'
                          : item.href === '/ops'
                          ? 'bg-red-600/10 text-hti-red border border-hti-red/20'
                          : item.href === '/reports'
                          ? 'bg-teal-600/10 text-hti-teal border border-hti-teal/20'
                          : 'bg-pink-600/10 text-pink-600 border border-pink-600/20'
                        : isDarkTheme
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
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
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
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
                  className={`w-full px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal focus:border-transparent ${
                    isDarkTheme
                      ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className={`mt-2 rounded-lg shadow-lg p-2 ${
                  isDarkTheme
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className={`text-sm p-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
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
              ? 'border-t border-gray-700 bg-gray-900'
              : 'border-t border-gray-200 bg-white'
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      active
                        ? item.href === '/board'
                          ? 'bg-blue-900/10 text-hti-navy'
                          : item.href === '/ops'
                          ? 'bg-red-600/10 text-hti-red'
                          : item.href === '/reports'
                          ? 'bg-teal-600/10 text-hti-teal'
                          : 'bg-pink-600/10 text-pink-600'
                        : isDarkTheme
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      <div className={isDarkTheme ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className={`flex items-center gap-2 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            <Link href="/" className={isDarkTheme ? 'hover:text-hti-teal-light' : 'hover:text-hti-teal'}>
              Home
            </Link>
            <span>/</span>
            <span className={isDarkTheme ? 'text-gray-200 font-medium' : 'text-gray-900 font-medium'}>
              {navItems.find(item => isActive(item.href))?.label || "Dashboard"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
