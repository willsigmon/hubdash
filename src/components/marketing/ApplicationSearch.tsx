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
    <section className="rounded-2xl border-2 border-default bg-surface p-4 sm:p-6 shadow-xl backdrop-blur-sm" style={{
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(12px) saturate(150%)',
      WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            Search &amp; amplify
          </p>
          <h3 className="mt-1 text-base sm:text-lg font-bold text-primary">
            Find the next story worth sharing
          </h3>
        </div>
        {resultCount !== undefined && totalCount !== undefined && (
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-alt backdrop-blur-sm border-2 border-default px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            {resultCount} of {totalCount} in view
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search organizations, contacts, counties, keywords..."
            className="w-full rounded-xl border-2 border-default bg-surface-alt backdrop-blur-sm px-11 py-2.5 text-sm text-primary placeholder:text-muted shadow-inner focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Search partnerships"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition hover:bg-surface hover:text-primary"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="hidden text-xs font-semibold uppercase tracking-wide text-muted md:block">
          Live sync
        </div>
      </div>

      {localQuery && (
        <p className="mt-3 text-xs text-secondary">
          <span className="font-semibold text-primary">Tip:</span> Search by organization,
          storyteller quotes, county name, or challenges they describe.
        </p>
      )}
    </section>
  );
}
