"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

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
  totalCount
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
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className="glass-card glass-card--subtle shadow-glass p-4 md:p-5 border border-white/25">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-glass-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search organizations, contacts, counties, keywords..."
            className="glass-input w-full pl-11 pr-11 py-3 text-sm font-medium"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-glass-muted" />
            </button>
          )}
        </div>

        {resultCount !== undefined && totalCount !== undefined && (
          <div className="glass-chip glass-chip--slate text-sm font-semibold px-4 py-2.5 whitespace-nowrap">
            Showing <span className="text-glass-bright font-bold">{resultCount}</span> of{' '}
            <span className="text-glass-bright font-bold">{totalCount}</span>
          </div>
        )}
      </div>

      {localQuery && (
        <div className="mt-3 pt-3 border-t glass-divider">
          <p className="text-xs text-glass-muted font-medium">
            <span className="font-semibold">Search tips:</span> Search by organization name, contact person, county, or any keywords in the application
          </p>
        </div>
      )}
    </div>
  );
}
