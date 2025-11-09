"use client";

import { ALL_STATUSES, CHROMEBOOK_RANGES, DATE_RANGES, FilterOptions } from "@/types/partnership";
import { ChevronDown, ChevronUp, Filter, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

interface ApplicationFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCounties: string[];
  availableOrgTypes: string[];
}

export default function ApplicationFilters({
  filters,
  onFiltersChange,
  availableCounties,
  availableOrgTypes
}: ApplicationFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>('status');

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCounty = (county: string) => {
    const newCounties = filters.counties.includes(county)
      ? filters.counties.filter(c => c !== county)
      : [...filters.counties, county];
    updateFilter('counties', newCounties);
  };

  const toggleStatus = (status: typeof ALL_STATUSES[number]) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    updateFilter('statuses', newStatuses);
  };

  const toggleOrgType = (type: string) => {
    const newTypes = filters.organizationTypes.includes(type)
      ? filters.organizationTypes.filter(t => t !== type)
      : [...filters.organizationTypes, type];
    updateFilter('organizationTypes', newTypes);
  };

  const setDateRange = (range: string) => {
    const now = new Date();
    let start: Date | null = null;

    switch (range) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        start = null;
        break;
    }

    updateFilter('dateRange', { start, end: start ? now : null });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      counties: [],
      statuses: [],
      chromebooksRange: { min: 0, max: 999999 },
      dateRange: { start: null, end: null },
      organizationTypes: [],
      firstTimeOnly: null,
      searchQuery: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.counties.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.chromebooksRange.min > 0 || filters.chromebooksRange.max < 999999) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.organizationTypes.length > 0) count++;
    if (filters.firstTimeOnly !== null) count++;
    if (filters.searchQuery) count++;
    return count;
  };

  const FilterSection = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
    const isActive = activeSection === id;

    return (
      <div className="border-b border-default last:border-b-0">
        <button
          onClick={() => setActiveSection(isActive ? null : id)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-alt transition-colors"
        >
          <span className="font-semibold text-primary">{title}</span>
          {isActive ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>
        {isActive && (
          <div className="px-4 py-3 bg-surface-alt backdrop-blur-sm">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl shadow-xl overflow-hidden border-2 border-default backdrop-blur-sm" style={{
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(12px) saturate(150%)',
      WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    }}>
      {/* Header */}
      <div className="accent-gradient text-on-accent px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold tracking-wide uppercase text-xs">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Quick Actions */}
          <div className="px-4 py-3 bg-surface-alt backdrop-blur-sm border-b border-default flex gap-2">
            <button
              onClick={clearAllFilters}
              className="flex-1 px-3 py-2 bg-surface hover:bg-surface-elevated border-2 border-default rounded-xl text-sm font-medium text-primary flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
            <button
              className="flex-1 px-3 py-2 accent-gradient text-on-accent rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              Save Preset
            </button>
          </div>

          {/* Filter Sections */}
          <div>
            {/* Status Filter */}
            <FilterSection title="Status" id="status">
              <div className="space-y-2">
                {ALL_STATUSES.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent focus:ring-offset-0 focus:ring-2"
                    />
                    <span className="text-sm text-secondary">{status}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                      status === 'Approved' ? 'bg-soft-success text-success' :
                      status === 'Pending' ? 'bg-soft-warning text-warning' :
                      status === 'In Review' ? 'bg-soft-accent text-accent' :
                      'bg-soft-danger text-danger'
                    }`}>
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* County Filter */}
            <FilterSection title="County" id="county">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableCounties.sort().map(county => (
                  <label key={county} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.counties.includes(county)}
                      onChange={() => toggleCounty(county)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent focus:ring-offset-0 focus:ring-2"
                    />
                    <span className="text-sm text-secondary">{county}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Chromebooks Needed Filter */}
            <FilterSection title="Chromebooks Needed" id="chromebooks">
              <div className="space-y-2">
                {CHROMEBOOK_RANGES.map(range => {
                  const isSelected = filters.chromebooksRange.min === range.min &&
                                    filters.chromebooksRange.max === range.max;

                  return (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="chromebookRange"
                        checked={isSelected}
                        onChange={() => updateFilter('chromebooksRange', { min: range.min, max: range.max })}
                        className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                      />
                      <span className="text-sm text-secondary">{range.label}</span>
                    </label>
                  );
                })}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="chromebookRange"
                    checked={filters.chromebooksRange.min === 0 && filters.chromebooksRange.max === 999999}
                    onChange={() => updateFilter('chromebooksRange', { min: 0, max: 999999 })}
                    className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="text-sm text-secondary">All</span>
                </label>
              </div>
            </FilterSection>

            {/* Date Range Filter */}
            <FilterSection title="Date Submitted" id="date">
              <div className="space-y-2">
                {DATE_RANGES.map(range => {
                  const isSelected =
                    (range.value === 'all' && !filters.dateRange.start && !filters.dateRange.end) ||
                    (filters.dateRange.start &&
                     Math.abs(new Date().getTime() - filters.dateRange.start.getTime()) <
                     (range.value === 'week' ? 8 : range.value === 'month' ? 31 : 91) * 24 * 60 * 60 * 1000);

                  return (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dateRange"
                        checked={!!isSelected}
                        onChange={() => setDateRange(range.value)}
                        className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                      />
                      <span className="text-sm text-secondary">{range.label}</span>
                    </label>
                  );
                })}
              </div>
            </FilterSection>

            {/* Organization Type Filter */}
            {availableOrgTypes.length > 0 && (
              <FilterSection title="Organization Type" id="orgType">
                <div className="space-y-2">
                  {availableOrgTypes.sort().map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.organizationTypes.includes(type)}
                        onChange={() => toggleOrgType(type)}
                        className="w-4 h-4 text-accent rounded focus:ring-accent focus:ring-offset-0 focus:ring-2"
                      />
                      <span className="text-sm text-secondary">{type}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* First-time vs Returning Filter */}
            <FilterSection title="Applicant Type" id="applicantType">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === null}
                    onChange={() => updateFilter('firstTimeOnly', null)}
                    className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="text-sm text-secondary">All Applicants</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === true}
                    onChange={() => updateFilter('firstTimeOnly', true)}
                    className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="text-sm text-secondary">First-time Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === false}
                    onChange={() => updateFilter('firstTimeOnly', false)}
                    className="w-4 h-4 text-accent focus:ring-accent focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="text-sm text-secondary">Returning Only</span>
                </label>
              </div>
            </FilterSection>
          </div>
        </>
      )}
    </div>
  );
}
