"use client";

import { Partnership, GROUPING_OPTIONS, GroupingOption, CHROMEBOOK_RANGES } from "@/types/partnership";
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

    applications.forEach(app => {
      let groupKey: string;

      switch (groupBy) {
        case 'status':
          groupKey = app.status;
          break;
        case 'county':
          groupKey = app.county || 'Unknown County';
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
          groupKey = app.organizationType || 'Unknown Type';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-hti-ember/15 text-hti-ember border-hti-ember/30';
      case 'Pending':
        return 'bg-hti-gold/20 text-hti-ember border-hti-gold/30';
      case 'In Review':
        return 'bg-hti-plum/15 text-hti-plum border-hti-plum/30';
      case 'Rejected':
        return 'bg-hti-fig/15 text-hti-plum border-hti-fig/30';
      default:
        return 'bg-hti-sand/70 text-hti-plum border-hti-fig/20';
    }
  };

  const ApplicationCard = ({ app }: { app: Partnership }) => {
    // Determine accent color based on status
    const getCardAccentColor = (status: string) => {
      switch (status) {
        case 'Pending':
          return 'from-hti-gold to-hti-ember';
        case 'In Review':
          return 'from-hti-plum to-hti-fig';
        case 'Approved':
          return 'from-hti-ember to-hti-sunset';
        case 'Rejected':
          return 'from-hti-fig to-hti-midnight';
        default:
          return 'from-hti-plum to-hti-dusk';
      }
    };

    return (
      <div
        onClick={() => onApplicationClick(app)}
        className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-hti-fig/12 hover:border-hti-fig/20 overflow-hidden hover:-translate-y-1"
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${getCardAccentColor(app.status)}`} />

        {/* Card Content */}
        <div className="p-6">
          {/* Header with Status Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-hti-plum text-lg mb-2 leading-snug group-hover:text-hti-ember transition-colors truncate">
                {app.organizationName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                {app.is501c3 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-hti-soleil/20 text-hti-ember border border-hti-soleil/40">
                    ✓ 501(c)(3)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Organization & Contact Info */}
          <div className="space-y-2 mb-4 pb-4 border-b border-hti-fig/12">
            <p className="text-sm text-hti-stone font-medium">
              <span className="text-hti-mist">Contact:</span> {app.contactPerson}
            </p>
            <p className="text-sm text-hti-stone">
              <span className="text-hti-mist">Location:</span> {app.county || 'Unknown County'}
            </p>
          </div>

          {/* Key Stats - Chromebooks & Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-hti-ember/12 via-hti-gold/10 to-white p-3 rounded-xl border border-hti-ember/20">
              <div className="text-xs text-hti-stone font-semibold mb-1 uppercase tracking-wide">Chromebooks</div>
              <div className="text-2xl font-bold text-hti-plum">{app.chromebooksNeeded}</div>
            </div>
            <div className="bg-hti-sand/70 p-3 rounded-xl border border-hti-fig/12">
              <div className="text-xs text-hti-stone font-semibold mb-1 uppercase tracking-wide">Submitted</div>
              <div className="text-sm font-semibold text-hti-plum">
                {new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Quote Section - if available */}
          {app.quote && (
            <div className="bg-gradient-to-br from-hti-plum/8 via-hti-ember/8 to-transparent p-4 rounded-xl border-l-4 border-hti-ember">
              <p className="text-sm text-hti-plum italic font-medium line-clamp-3 leading-relaxed">
                "{app.quote.substring(0, 140)}..."
              </p>
            </div>
          )}

          {/* Click Indicator */}
          <div className="mt-4 text-center text-xs text-hti-mist font-medium group-hover:text-hti-ember transition-colors">
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
      'Pending': 'from-hti-gold/20 to-hti-soleil/15 border-hti-gold/30',
      'In Review': 'from-hti-plum/20 to-hti-fig/15 border-hti-plum/30',
      'Approved': 'from-hti-ember/20 to-hti-sunset/15 border-hti-ember/25',
      'Rejected': 'from-hti-fig/20 to-hti-midnight/20 border-hti-fig/25'
    };
    return statusColors[group] || 'from-hti-sand/70 to-white border-hti-fig/12';
  };

  return (
    <div className="space-y-6">
      {/* Group By Selector */}
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-hti-fig/12">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-hti-ember" />
          <label className="text-sm font-semibold text-hti-plum">Group by:</label>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupingOption['value'])}
            className="flex-1 px-4 py-2 border border-hti-fig/15 rounded-xl focus:ring-2 focus:ring-hti-ember focus:border-hti-ember text-hti-plum bg-white"
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
            <div key={groupKey} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-hti-fig/12 hover:border-hti-fig/20 transition-all">
              {/* Group Header with pizzazz */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r ${getGroupColor(groupKey)} hover:shadow-md transition-all border-b border-white/20 group cursor-pointer`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getGroupIcon(groupKey)}</span>
                  <div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${
                      groupBy === 'status' ? getStatusColor(groupKey) : 'bg-hti-plum text-white border border-white/20'
                    }`}>
                      {groupKey}
                    </div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-white/70 rounded-full">
                    <span className="text-sm font-semibold text-hti-stone">
                      {groupApps.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-hti-stone font-medium">
                    {isCollapsed ? 'Show' : 'Hide'}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-hti-stone group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-hti-stone group-hover:-translate-y-1 transition-transform" />
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
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-hti-mist mb-4">
            <Layers className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-hti-plum mb-2">
            No applications found
          </h3>
          <p className="text-hti-stone">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
