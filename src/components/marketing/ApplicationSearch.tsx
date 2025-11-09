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
    <section className="rounded-3xl border border-default bg-gradient-to-br from-hti-orange/8 via-white to-hti-gold/5 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Search &amp; amplify
          </p>
          <h3 className="mt-1 text-lg font-semibold text-primary">
            Find the next story worth sharing
          </h3>
        </div>
        {resultCount !== undefined && totalCount !== undefined && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-success" />
            {resultCount} of {totalCount} in view
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search organizations, contacts, counties, keywords..."
            className="w-full rounded-2xl border border-default bg-white/80 px-12 py-3 text-primary shadow-inner focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20 placeholder:text-muted"
            aria-label="Search partnerships"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition hover:bg-surface"
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
