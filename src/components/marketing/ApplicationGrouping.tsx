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

    return (
      <div
        onClick={() => onApplicationClick(app)}
        className="group bg-surface rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-default hover:border-strong overflow-hidden hover:-translate-y-1"
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 ${getCardAccentColor(app.status)}`} />

        {/* Card Content */}
        <div className="p-6">
          {/* Header with Status Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-primary text-lg mb-2 leading-snug group-hover:text-accent transition-colors truncate">
                {app.organizationName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                {app.is501c3 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-soft-accent text-accent border border-accent">
                    ✓ 501(c)(3)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Organization & Contact Info */}
          <div className="space-y-2 mb-4 pb-4 border-b border-default">
            <p className="text-sm text-secondary font-medium">
              <span className="text-muted">Contact:</span> {app.contactPerson}
            </p>
            <p className="text-sm text-secondary">
              <span className="text-muted">Location:</span> {app.county || 'Unknown County'}
            </p>
          </div>

          {/* Key Stats - Chromebooks & Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-xl border border-default bg-surface-alt">
              <div className="text-xs text-secondary font-semibold mb-1 uppercase tracking-wide">Chromebooks</div>
              <div className="text-2xl font-bold text-primary">{app.chromebooksNeeded}</div>
            </div>
            <div className="p-3 rounded-xl border border-default bg-surface-alt">
              <div className="text-xs text-secondary font-semibold mb-1 uppercase tracking-wide">Submitted</div>
              <div className="text-sm font-semibold text-primary">
                {new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Quote Section - if available */}
          {app.quote && (
            <div className="p-4 rounded-xl border-l-4 border-accent bg-soft-accent">
              <p className="text-sm text-secondary italic font-medium line-clamp-3 leading-relaxed">
                "{app.quote.substring(0, 140)}..."
              </p>
            </div>
          )}

          {/* Click Indicator */}
          <div className="mt-4 text-center text-xs text-muted font-medium group-hover:text-accent transition-colors">
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
      <div className="bg-surface rounded-2xl shadow-xl p-4 border border-default">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-accent" />
          <label className="text-sm font-semibold text-primary">Group by:</label>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupingOption['value'])}
            className="flex-1 px-4 py-2 border border-default rounded-xl focus-ring text-primary bg-surface-alt"
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
            <div key={groupKey} className="bg-surface rounded-2xl shadow-xl overflow-hidden border border-default hover:border-strong transition-all">
              {/* Group Header with pizzazz */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full px-6 py-5 flex items-center justify-between ${getGroupColor(groupKey)} hover:shadow-md transition-all border-b border-default group cursor-pointer rounded-t-2xl`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getGroupIcon(groupKey)}</span>
                  <div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${
                      groupBy === 'status' ? getStatusColor(groupKey) : 'bg-soft-accent text-accent border border-accent/30'
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
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
