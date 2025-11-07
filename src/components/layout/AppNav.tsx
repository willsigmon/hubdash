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
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

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
      active: "bg-gradient-to-r from-hti-plum/15 via-hti-fig/10 to-hti-teal/10 text-hti-plum border-hti-plum/30 shadow-md",
    },
    {
      href: "/ops",
      label: "Operations",
      icon: Zap,
      active: "bg-gradient-to-r from-hti-ember/15 via-hti-sunset/10 to-hti-yellow/10 text-hti-ember border-hti-ember/30 shadow-md",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: FileText,
      active: "bg-gradient-to-r from-hti-gold/20 via-white/60 to-hti-fig/10 text-hti-fig border-hti-gold/40 shadow-md",
    },
    {
      href: "/marketing",
      label: "Marketing",
      icon: Megaphone,
      active: "bg-gradient-to-r from-hti-teal/15 via-hti-sunset/10 to-hti-navy/10 text-hti-navy border-hti-teal/30 shadow-md",
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);
  const isHome = pathname === "/";

  // Don't show nav on home page
  if (isHome) return null;

  return (
    <>
      {/* Desktop Navigation - Light Glass Theme */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18 py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/hti-logo.svg"
                alt="HTI Logo"
                className="h-10 w-auto drop-shadow-sm transition-transform group-hover:scale-[1.02]"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-lg text-hti-plum tracking-tight">HUBDash</span>
                <span className="text-[11px] font-semibold text-hti-stone/70 uppercase tracking-[0.28em]">HTI Platform</span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border bg-white/65 text-hti-stone/90 hover:text-hti-plum hover:shadow-lg hover:-translate-y-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-teal/40 ${active ? `${item.active}` : "border-white/0"
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
              {/* Theme Toggle */}
              <ThemeToggleCompact />

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition-colors text-hti-stone/70 hover:bg-hti-sand/70 hover:text-hti-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-teal/40"
                aria-label="Global search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors text-hti-stone/80 hover:bg-hti-sand/70 hover:text-hti-plum"
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
                  className="w-full px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 bg-white border border-hti-fig/15 text-hti-stone placeholder-hti-mist/80 focus:ring-hti-plum/30"
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
                <div className="mt-2 rounded-lg shadow-lg p-2 bg-white border border-hti-fig/10">
                  <div className="text-sm p-2 text-hti-stone/80">
                    Press Enter to search across all data...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-hti-plum/10 bg-white/95">
            <div className="px-4 pt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all border bg-white/70 text-hti-stone hover:text-hti-plum ${active ? `${item.active}` : "border-transparent"
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

      {/* Breadcrumb Trail */}
      <div className="bg-gradient-to-r from-white/80 via-hti-sand/70 to-white/80 border-b border-hti-plum/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-2 text-sm text-hti-stone/80">
            <Link href="/" className="hover:text-hti-plum font-medium">
              Home
            </Link>
            <span>/</span>
            <span className="text-hti-plum font-semibold">
              {navItems.find(item => isActive(item.href))?.label || "Dashboard"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
