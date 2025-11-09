"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ApplicationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export default function ApplicationSearch({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: ApplicationSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <section className="rounded-2xl border-2 border-white/10 bg-gradient-to-br from-hti-navy via-hti-navy-dark to-hti-navy p-4 sm:p-6 shadow-xl backdrop-blur-sm" style={{
      background: 'linear-gradient(135deg, rgba(27, 54, 93, 0.95), rgba(15, 31, 61, 0.98), rgba(27, 54, 93, 0.95))',
      backdropFilter: 'blur(12px) saturate(150%)',
      WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hti-gold">
            Search &amp; amplify
          </p>
          <h3 className="mt-1 text-base sm:text-lg font-bold text-white">
            Find the next story worth sharing
          </h3>
        </div>
        {resultCount !== undefined && totalCount !== undefined && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {resultCount} of {totalCount} in view
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search organizations, contacts, counties, keywords..."
            className="w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-11 py-2.5 text-sm text-white placeholder:text-white/50 shadow-inner focus:border-hti-gold focus:outline-none focus:ring-2 focus:ring-hti-gold/30"
            aria-label="Search partnerships"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="hidden text-xs font-semibold uppercase tracking-wide text-white/70 md:block">
          Live sync
        </div>
      </div>

      {localQuery && (
        <p className="mt-3 text-xs text-white/70">
          <span className="font-semibold text-white">Tip:</span> Search by organization,
          storyteller quotes, county name, or challenges they describe.
        </p>
      )}
    </section>
  );
}
