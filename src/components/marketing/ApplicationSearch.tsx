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
    <div className="bg-surface rounded-2xl shadow-xl p-4 border border-default">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search organizations, contacts, counties, keywords..."
            className="w-full pl-10 pr-10 py-3 border border-default rounded-xl focus-ring text-primary placeholder:text-muted bg-surface-alt"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-alt rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>

        {resultCount !== undefined && totalCount !== undefined && (
          <div className="text-sm text-secondary whitespace-nowrap">
            Showing <span className="font-semibold text-primary">{resultCount}</span> of{' '}
            <span className="font-semibold text-primary">{totalCount}</span>
          </div>
        )}
      </div>

      {localQuery && (
        <div className="mt-2 text-xs text-secondary">
          <span className="font-medium">Search tips:</span> Search by organization name, contact person, county, or any keywords in the application
        </div>
      )}
    </div>
  );
}
