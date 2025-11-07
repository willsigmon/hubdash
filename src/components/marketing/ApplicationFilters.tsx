"use client";

import { useState } from "react";
import { FilterOptions, ALL_STATUSES, CHROMEBOOK_RANGES, DATE_RANGES } from "@/types/partnership";
import { Filter, ChevronDown, ChevronUp, Save, RotateCcw, CheckCircle2 } from "lucide-react";

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
      <div className="border-b glass-divider last:border-b-0">
        <button
          onClick={() => setActiveSection(isActive ? null : id)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors text-glass-bright group"
        >
          <span className="font-semibold text-sm tracking-wide">{title}</span>
          {isActive ? (
            <ChevronUp className="w-4 h-4 text-glass-muted group-hover:text-glass-bright transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-glass-muted group-hover:text-glass-bright transition-colors" />
          )}
        </button>
        {isActive && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/15 text-green-700 border-green-500/40';
      case 'Pending':
        return 'bg-hti-yellow/20 text-hti-navy border-hti-yellow/50';
      case 'In Review':
        return 'bg-hti-teal/15 text-hti-teal-dark border-hti-teal/40';
      case 'Rejected':
        return 'bg-red-500/15 text-red-700 border-red-500/40';
      default:
        return 'bg-hti-sand/60 text-hti-stone border-hti-stone/30';
    }
  };

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden border border-white/25">
      <div className={`glass-card__glow bg-gradient-to-br from-hti-teal/30 to-hti-navy/25`} />

      {/* Header */}
      <div className="relative px-5 py-4 border-b glass-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-hti-teal/20 to-hti-navy/10 rounded-lg">
              <Filter className="w-5 h-5 text-hti-teal" />
            </div>
            <div>
              <h3 className="font-bold text-glass-bright text-base">Filter Applications</h3>
              {getActiveFilterCount() > 0 && (
                <p className="text-xs text-glass-muted mt-0.5">
                  {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-glass-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-glass-muted" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-1">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-4 pb-4 border-b glass-divider">
            <button
              onClick={clearAllFilters}
              className="flex-1 glass-button text-sm font-semibold flex items-center justify-center gap-2"
              disabled={getActiveFilterCount() === 0}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
            <button
              className="glass-button glass-button--accent text-sm font-semibold flex items-center justify-center gap-2"
              title="Save filter preset (coming soon)"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>

          {/* Filter Sections */}
          <div className="space-y-0">
            {/* Status Filter */}
            <FilterSection title="Status" id="status">
              <div className="space-y-2.5">
                {ALL_STATUSES.map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-4 h-4 text-hti-teal rounded focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                    />
                    <span className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    {filters.statuses.includes(status) && (
                      <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                    )}
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* County Filter */}
            <FilterSection title="County" id="county">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableCounties.sort().map(county => (
                  <label key={county} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.counties.includes(county)}
                      onChange={() => toggleCounty(county)}
                      className="w-4 h-4 text-hti-teal rounded focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm text-glass-bright font-medium flex-1">{county}</span>
                    {filters.counties.includes(county) && (
                      <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                    )}
                  </label>
                ))}
                {availableCounties.length === 0 && (
                  <p className="text-sm text-glass-muted py-2">No counties available</p>
                )}
              </div>
            </FilterSection>

            {/* Chromebooks Needed Filter */}
            <FilterSection title="Chromebooks Needed" id="chromebooks">
              <div className="space-y-2.5">
                {CHROMEBOOK_RANGES.map(range => {
                  const isSelected = filters.chromebooksRange.min === range.min &&
                    filters.chromebooksRange.max === range.max;

                  return (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="chromebookRange"
                        checked={isSelected}
                        onChange={() => updateFilter('chromebooksRange', { min: range.min, max: range.max })}
                        className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                      />
                      <span className="text-sm text-glass-bright font-medium flex-1">{range.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                      )}
                    </label>
                  );
                })}
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="chromebookRange"
                    checked={filters.chromebooksRange.min === 0 && filters.chromebooksRange.max === 999999}
                    onChange={() => updateFilter('chromebooksRange', { min: 0, max: 999999 })}
                    className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="text-sm text-glass-bright font-medium flex-1">All</span>
                  {(filters.chromebooksRange.min === 0 && filters.chromebooksRange.max === 999999) && (
                    <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                  )}
                </label>
              </div>
            </FilterSection>

            {/* Date Range Filter */}
            <FilterSection title="Date Submitted" id="date">
              <div className="space-y-2.5">
                {DATE_RANGES.map(range => {
                  const isSelected =
                    (range.value === 'all' && !filters.dateRange.start && !filters.dateRange.end) ||
                    (filters.dateRange.start &&
                      Math.abs(new Date().getTime() - filters.dateRange.start.getTime()) <
                      (range.value === 'week' ? 8 : range.value === 'month' ? 31 : 91) * 24 * 60 * 60 * 1000);

                  return (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="dateRange"
                        checked={!!isSelected}
                        onChange={() => setDateRange(range.value)}
                        className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                      />
                      <span className="text-sm text-glass-bright font-medium flex-1">{range.label}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                      )}
                    </label>
                  );
                })}
              </div>
            </FilterSection>

            {/* Organization Type Filter */}
            {availableOrgTypes.length > 0 && (
              <FilterSection title="Organization Type" id="orgType">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableOrgTypes.sort().map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.organizationTypes.includes(type)}
                        onChange={() => toggleOrgType(type)}
                        className="w-4 h-4 text-hti-teal rounded focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                      />
                      <span className="text-sm text-glass-bright font-medium flex-1 capitalize">{type}</span>
                      {filters.organizationTypes.includes(type) && (
                        <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                      )}
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* First-time vs Returning Filter */}
            <FilterSection title="Applicant Type" id="applicantType">
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === null}
                    onChange={() => updateFilter('firstTimeOnly', null)}
                    className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="text-sm text-glass-bright font-medium flex-1">All Applicants</span>
                  {filters.firstTimeOnly === null && (
                    <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === true}
                    onChange={() => updateFilter('firstTimeOnly', true)}
                    className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="text-sm text-glass-bright font-medium flex-1">First-time Only</span>
                  {filters.firstTimeOnly === true && (
                    <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="firstTime"
                    checked={filters.firstTimeOnly === false}
                    onChange={() => updateFilter('firstTimeOnly', false)}
                    className="w-4 h-4 text-hti-teal focus:ring-hti-teal focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="text-sm text-glass-bright font-medium flex-1">Returning Only</span>
                  {filters.firstTimeOnly === false && (
                    <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                  )}
                </label>
              </div>
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  );
}
