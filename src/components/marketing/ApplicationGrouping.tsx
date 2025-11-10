"use client";

import { CHROMEBOOK_RANGES, GROUPING_OPTIONS, GroupingOption, Partnership } from "@/types/partnership";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { useState } from "react";

interface ApplicationGroupingProps {
  applications: Partnership[];
  groupBy: GroupingOption['value'];
  onGroupByChange: (groupBy: GroupingOption['value']) => void;
  onApplicationClick: (application: Partnership) => void;
}

interface GroupedApplications {
  [key: string]: Partnership[];
}

export default function ApplicationGrouping({
  applications,
  groupBy,
  onGroupByChange,
  onApplicationClick
}: ApplicationGroupingProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey);
    } else {
      newCollapsed.add(groupKey);
    }
    setCollapsedGroups(newCollapsed);
  };

  const groupApplications = (): GroupedApplications => {
    const grouped: GroupedApplications = {};

    if (!Array.isArray(applications)) {
      return grouped;
    }

    applications.forEach(app => {
      if (!app || typeof app !== 'object') {
        return;
      }

      let groupKey: string;

      switch (groupBy) {
        case 'status':
          groupKey = app.status || 'Unknown';
          break;
        case 'county':
          groupKey = app.county || 'Unknown County';
          break;
        case 'chromebooks':
          const chromebooksNeeded = typeof app.chromebooksNeeded === 'number' ? app.chromebooksNeeded : 0;
          const range = CHROMEBOOK_RANGES.find(r =>
            chromebooksNeeded >= r.min && chromebooksNeeded <= r.max
          );
          groupKey = range ? range.label : 'Other';
          break;
        case 'date':
          if (!app.timestamp) {
            groupKey = 'Unknown';
            break;
          }
          try {
            const date = new Date(app.timestamp);
            if (isNaN(date.getTime())) {
              groupKey = 'Unknown';
              break;
            }
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff <= 7) groupKey = 'This Week';
            else if (daysDiff <= 30) groupKey = 'This Month';
            else if (daysDiff <= 90) groupKey = 'This Quarter';
            else groupKey = 'Older';
          } catch (e) {
            groupKey = 'Unknown';
          }
          break;
        case 'orgType':
          groupKey = app.organizationType || 'Unknown Type';
          break;
        case 'firstTime':
          groupKey = typeof app.firstTime === 'boolean' ? (app.firstTime ? 'First-time Applicants' : 'Returning Applicants') : 'Unknown';
          break;
        default:
          groupKey = 'All';
      }

      if (!groupKey) {
        groupKey = 'All';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(app);
    });

    return grouped;
  };

  const grouped = groupApplications();
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    // Custom sort order for status
    if (groupBy === 'status') {
      const statusOrder = { 'In Review': 0, 'Pending': 1, 'Approved': 2, 'Rejected': 3 };
      return (statusOrder[a as keyof typeof statusOrder] || 999) - (statusOrder[b as keyof typeof statusOrder] || 999);
    }
    // Custom sort order for date
    if (groupBy === 'date') {
      const dateOrder = { 'This Week': 0, 'This Month': 1, 'This Quarter': 2, 'Older': 3 };
      return (dateOrder[a as keyof typeof dateOrder] || 999) - (dateOrder[b as keyof typeof dateOrder] || 999);
    }
    return a.localeCompare(b);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-soft-success text-success border-success';
      case 'Pending':
        return 'bg-soft-highlight text-highlight border-highlight';
      case 'In Review':
        return 'bg-soft-accent text-accent border-accent';
      case 'Rejected':
        return 'bg-soft-danger text-danger border-danger';
      default:
        return 'bg-surface-alt text-secondary border-default';
    }
  };

  const ApplicationCard = ({ app }: { app: Partnership }) => {
    // Determine accent color based on status
    const getCardAccentColor = (status: string) => {
      switch (status) {
        case 'Pending':
          return 'accent-gradient';
        case 'In Review':
          return 'accent-gradient';
        case 'Approved':
          return 'accent-gradient';
        case 'Rejected':
          return 'accent-gradient';
        default:
          return 'accent-gradient';
      }
    };

    // Extract contact info with better fallbacks
    const contactPerson = app.contactPerson || app.email?.split('@')[0] || 'Contact Not Provided';
    const location = app.county || app.address?.split(',')[1]?.trim() || 'Location Not Provided';
    const orgName = app.organizationName || 'Unnamed Organization';

    return (
      <div
        onClick={() => onApplicationClick(app)}
        className="group bg-surface rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-default hover:border-accent overflow-hidden flex flex-col h-full backdrop-blur-sm"
        style={{
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
        }}
      >
        {/* Top Accent Bar */}
        <div className={`h-2 ${getCardAccentColor(app.status)}`} />

        {/* Card Content - Flex column to ensure consistent height */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 bg-gradient-to-br from-surface-alt/50 via-transparent to-surface-alt/50">
          {/* Header with Status Badge */}
          <div className="mb-4">
            <h4 className="font-bold text-primary text-base sm:text-lg mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2 min-h-[3rem]">
              {orgName}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getStatusColor(app.status)}`}>
                {app.status || 'Pending'}
              </span>
              {app.is501c3 && (
                <span className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-soft-success text-success border border-success backdrop-blur-sm">
                  ✓ 501(c)(3)
                </span>
              )}
            </div>
          </div>

          {/* Organization & Contact Info - Better line-up with more info */}
          <div className="space-y-2 mb-4 pb-4 border-b-2 border-default flex-grow">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-start">
              <span className="text-[10px] sm:text-xs text-muted font-bold uppercase tracking-wider">Contact:</span>
              <div className="space-y-1">
                <div className="text-sm sm:text-base text-primary font-semibold break-words">
                  {contactPerson !== 'Contact Not Provided' ? contactPerson : <span className="text-muted italic">Not provided</span>}
                </div>
                {app.email && (
                  <div className="text-xs text-secondary break-all">{app.email}</div>
                )}
                {app.phone && (
                  <div className="text-xs text-secondary">{app.phone}</div>
                )}
              </div>

              <span className="text-[10px] sm:text-xs text-muted font-bold uppercase tracking-wider">Location:</span>
              <div className="space-y-1">
                <div className="text-sm sm:text-base text-primary font-semibold break-words">
                  {location !== 'Location Not Provided' ? location : <span className="text-muted italic">Not provided</span>}
                </div>
                {app.organizationType && (
                  <div className="text-xs text-secondary">{app.organizationType}</div>
                )}
                {app.address && (
                  <div className="text-xs text-secondary line-clamp-1">{app.address}</div>
                )}
              </div>
            </div>
          </div>

          {/* Key Stats - Chromebooks & Date */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 sm:p-4 rounded-xl border-2 border-default bg-surface-alt backdrop-blur-sm">
              <div className="text-[10px] sm:text-xs text-secondary font-bold mb-1.5 uppercase tracking-wider">Chromebooks</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">{typeof app.chromebooksNeeded === 'number' ? app.chromebooksNeeded.toLocaleString() : 0}</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border-2 border-default bg-surface-alt backdrop-blur-sm">
              <div className="text-[10px] sm:text-xs text-secondary font-bold mb-1.5 uppercase tracking-wider">Submitted</div>
              <div className="text-sm sm:text-base font-bold text-primary">
                {app.timestamp ? (() => {
                  try {
                    const date = new Date(app.timestamp);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                  } catch (e) {
                    // Fall through to return '—'
                  }
                  return '—';
                })() : '—'}
              </div>
            </div>
          </div>

          {/* Quote Section - Always show space, but only render if quote exists */}
          <div className="mb-4 flex-1 flex items-start">
            {app.quote ? (
              <div className="p-3 sm:p-4 rounded-xl border-l-4 border-accent bg-soft-accent backdrop-blur-sm w-full">
                <p className="text-xs sm:text-sm text-secondary italic font-medium line-clamp-2 leading-relaxed">
                  "{app.quote}"
                </p>
              </div>
            ) : (
              <div className="h-full w-full" /> // Spacer to maintain consistent height
            )}
          </div>

          {/* Click Indicator */}
          <div className="mt-auto pt-3 border-t border-default text-center text-xs sm:text-sm text-muted font-semibold group-hover:text-accent transition-colors">
            Click to view details →
          </div>
        </div>
      </div>
    );
  };

  const getGroupIcon = (group: string) => {
    const statusIcons: Record<string, string> = {
      'Pending': '⏳',
      'In Review': '👀',
      'Approved': '✅',
      'Rejected': '❌'
    };
    return statusIcons[group] || '📁';
  };

  const getGroupColor = (group: string) => {
    const statusColors: Record<string, string> = {
      'Pending': 'bg-soft-warning border-warning/30',
      'In Review': 'bg-soft-accent border-accent/30',
      'Approved': 'bg-soft-success border-success/30',
      'Rejected': 'bg-soft-danger border-danger/30'
    };
    return statusColors[group] || 'bg-surface-alt border-default';
  };

  return (
    <div className="space-y-6">
      {/* Group By Selector */}
      <div className="bg-surface rounded-2xl shadow-xl p-4 border-2 border-default backdrop-blur-sm" style={{
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
      }}>
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-accent" />
          <label className="text-sm font-semibold text-primary">Group by:</label>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupingOption['value'])}
            className="flex-1 px-4 py-2 border-2 border-default rounded-xl focus-ring text-primary bg-surface-alt backdrop-blur-sm"
          >
            {GROUPING_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped Applications */}
      <div className="space-y-6">
        {groupKeys.map(groupKey => {
          const groupApps = grouped[groupKey];
          const isCollapsed = collapsedGroups.has(groupKey);

          return (
            <div key={groupKey} className="bg-surface rounded-2xl shadow-xl overflow-hidden border-2 border-default hover:border-strong transition-all backdrop-blur-sm" style={{
              background: 'var(--bg-surface)',
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            }}>
              {/* Group Header with pizzazz */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full px-6 py-5 flex items-center justify-between ${getGroupColor(groupKey)} hover:shadow-md transition-all border-b-2 border-default group cursor-pointer rounded-t-2xl backdrop-blur-sm`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getGroupIcon(groupKey)}</span>
                  <div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${groupBy === 'status' ? getStatusColor(groupKey) : 'bg-soft-accent text-accent border border-accent/30'
                      }`}>
                      {groupKey}
                    </div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-surface-alt rounded-full border border-default">
                    <span className="text-sm font-semibold text-secondary">
                      {groupApps.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary font-medium">
                    {isCollapsed ? 'Show' : 'Hide'}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-muted group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-muted group-hover:-translate-y-1 transition-transform" />
                  )}
                </div>
              </button>

              {/* Group Content */}
              {!isCollapsed && (
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {groupApps.map(app => (
                    <ApplicationCard key={app.id} app={app} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {groupKeys.length === 0 && (
        <div className="bg-surface rounded-xl shadow-lg p-12 text-center border border-default">
          <div className="text-muted mb-4">
            <Layers className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            No applications found
          </h3>
          <p className="text-secondary">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
