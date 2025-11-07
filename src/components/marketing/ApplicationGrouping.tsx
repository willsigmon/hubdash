"use client";

import { Partnership, GROUPING_OPTIONS, GroupingOption, CHROMEBOOK_RANGES } from "@/types/partnership";
import { ChevronDown, ChevronUp, Layers, Mail, Phone, MapPin, Calendar, Users, Building2, CheckCircle2, Clock, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { formatDaysAgo, formatPlural } from "@/lib/utils/date-formatters";

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

    applications.forEach(app => {
      let groupKey: string;

      switch (groupBy) {
        case 'status':
          groupKey = app.status;
          break;
        case 'county':
          groupKey = app.county || 'Not Specified';
          break;
        case 'chromebooks':
          const range = CHROMEBOOK_RANGES.find(r =>
            app.chromebooksNeeded >= r.min && app.chromebooksNeeded <= r.max
          );
          groupKey = range ? range.label : 'Other';
          break;
        case 'date':
          const date = new Date(app.timestamp);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 7) groupKey = 'This Week';
          else if (daysDiff <= 30) groupKey = 'This Month';
          else if (daysDiff <= 90) groupKey = 'This Quarter';
          else groupKey = 'Older';
          break;
        case 'orgType':
          groupKey = app.organizationType || 'Not Specified';
          break;
        case 'firstTime':
          groupKey = app.firstTime ? 'First-time Applicants' : 'Returning Applicants';
          break;
        default:
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-green-500/15',
          text: 'text-green-700',
          border: 'border-green-500/40',
          icon: <CheckCircle2 className="w-4 h-4" />,
          accent: 'from-green-500/20 to-green-600/10'
        };
      case 'Pending':
        return {
          bg: 'bg-hti-yellow/20',
          text: 'text-hti-navy',
          border: 'border-hti-yellow/50',
          icon: <Clock className="w-4 h-4" />,
          accent: 'from-hti-yellow/25 to-hti-orange/15'
        };
      case 'In Review':
        return {
          bg: 'bg-hti-teal/15',
          text: 'text-hti-teal-dark',
          border: 'border-hti-teal/40',
          icon: <AlertCircle className="w-4 h-4" />,
          accent: 'from-hti-teal/25 to-hti-navy/15'
        };
      case 'Rejected':
        return {
          bg: 'bg-red-500/15',
          text: 'text-red-700',
          border: 'border-red-500/40',
          icon: <XCircle className="w-4 h-4" />,
          accent: 'from-red-500/20 to-red-600/10'
        };
      default:
        return {
          bg: 'bg-hti-sand/60',
          text: 'text-hti-stone',
          border: 'border-hti-stone/30',
          icon: <AlertCircle className="w-4 h-4" />,
          accent: 'from-hti-sand/40 to-white'
        };
    }
  };

  const ApplicationCard = ({ app }: { app: Partnership }) => {
    const statusConfig = getStatusConfig(app.status);
    const daysSinceSubmission = Math.floor((Date.now() - new Date(app.timestamp).getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div
        onClick={() => onApplicationClick(app)}
        className="group glass-card glass-card--subtle shadow-glass hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/25 hover:border-white/40 overflow-hidden hover:-translate-y-1"
      >
        <div className={`glass-card__glow bg-gradient-to-br ${statusConfig.accent}`} />

        <div className="relative p-5 space-y-4 z-10">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-glass-bright text-lg mb-2 leading-tight group-hover:text-hti-teal transition-colors line-clamp-2">
                {app.organizationName}
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                  {statusConfig.icon}
                  {app.status}
                </span>
                {app.is501c3 && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-700 border border-green-500/30 group/501c3 relative"
                    title="501(c)(3) tax-exempt status verified"
                  >
                    ✓ 501(c)(3)
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-hti-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover/501c3:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      Tax-exempt status verified
                    </span>
                  </span>
                )}
                {app.firstTime && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-hti-teal/15 text-hti-teal-dark border border-hti-teal/30">
                    🆕 New
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 backdrop-blur-sm px-3 py-2.5 border border-white/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-glass-muted" />
                <span className="text-xs text-glass-muted font-medium">Chromebooks</span>
              </div>
              <div className="text-2xl font-bold text-glass-bright">
                {formatPlural(app.chromebooksNeeded, 'Chromebook')}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-3 py-2.5 border border-white/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-glass-muted" />
                <span className="text-xs text-glass-muted font-medium">Submitted</span>
              </div>
              <div className="text-sm font-bold text-glass-bright">
                {new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              {daysSinceSubmission > 0 && (
                <div className="text-[10px] text-glass-muted mt-0.5">
                  {formatDaysAgo(daysSinceSubmission)}
                </div>
              )}
            </div>
          </div>

          {/* Contact & Location Info */}
          <div className="space-y-2 pt-3 border-t glass-divider">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-glass-muted flex-shrink-0" />
              <span className="text-glass-muted font-medium">Contact:</span>
              <span className="text-glass-bright font-semibold truncate">{app.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-glass-muted flex-shrink-0" />
              <span className="text-glass-muted font-medium">Location:</span>
              <span className="text-glass-bright font-semibold">{app.county || <span className="text-glass-muted italic">Not specified</span>}</span>
            </div>
            {app.organizationType && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-glass-muted flex-shrink-0" />
                <span className="text-glass-muted font-medium">Type:</span>
                <span className="text-glass-bright font-semibold capitalize">{app.organizationType}</span>
              </div>
            )}
          </div>

          {/* Quote Preview - if available */}
          {app.quote && (
            <div className="pt-3 border-t glass-divider">
              <div className="bg-gradient-to-br from-hti-navy/10 via-hti-teal/8 to-transparent p-3 rounded-lg border-l-2 border-hti-teal/50">
                <p className="text-xs text-glass-muted italic font-medium line-clamp-2 leading-relaxed">
                  "{app.quote.substring(0, 100)}{app.quote.length > 100 ? '...' : ''}"
                </p>
              </div>
            </div>
          )}

          {/* Action Hint */}
          <div className="pt-2 text-center">
            <span className="text-xs text-glass-muted font-medium group-hover:text-glass-bright transition-colors">
              View details →
            </span>
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
      'Pending': 'from-hti-yellow/25 to-hti-orange/15 border-hti-yellow/40',
      'In Review': 'from-hti-teal/25 to-hti-navy/15 border-hti-teal/40',
      'Approved': 'from-green-500/25 to-green-600/15 border-green-500/40',
      'Rejected': 'from-red-500/25 to-red-600/15 border-red-500/40'
    };
    return statusColors[group] || 'from-hti-sand/40 to-white border-white/30';
  };

  return (
    <div className="space-y-6">
      {/* Group By Selector */}
      <div className="glass-card glass-card--subtle shadow-glass p-4 border border-white/25">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-hti-teal" />
          <label className="text-sm font-semibold text-glass-bright">Group by:</label>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupingOption['value'])}
            className="flex-1 px-4 py-2 glass-input glass-input--select text-sm font-medium"
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
            <div key={groupKey} className="glass-card glass-card--subtle shadow-glass overflow-hidden border border-white/20 transition-all">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r ${getGroupColor(groupKey)} hover:shadow-lg transition-all border-b border-white/25 group cursor-pointer`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getGroupIcon(groupKey)}</span>
                  <div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-sm border ${groupBy === 'status' ? getStatusConfig(groupKey).bg + ' ' + getStatusConfig(groupKey).text + ' ' + getStatusConfig(groupKey).border : 'bg-white/50 text-glass-bright border-white/50'
                      }`}>
                      {groupKey}
                    </div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-white/60 rounded-full">
                    <span className="text-sm font-semibold text-glass-bright">
                      {groupApps.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-glass-muted font-medium">
                    {isCollapsed ? 'Show' : 'Hide'}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-glass-bright group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-glass-bright group-hover:-translate-y-1 transition-transform" />
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
        <div className="glass-card glass-card--subtle shadow-glass p-12 text-center border border-white/30">
          <div className="text-glass-muted mb-4">
            <Layers className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-glass-bright mb-2">
            No applications found
          </h3>
          <p className="text-glass-muted">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
