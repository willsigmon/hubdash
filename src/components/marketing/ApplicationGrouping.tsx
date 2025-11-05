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
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'In Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const ApplicationCard = ({ app }: { app: Partnership }) => {
    // Determine accent color based on status
    const getCardAccentColor = (status: string) => {
      switch (status) {
        case 'Pending':
          return 'from-yellow-400 to-yellow-500';
        case 'In Review':
          return 'from-blue-500 to-blue-600';
        case 'Approved':
          return 'from-green-500 to-green-600';
        case 'Rejected':
          return 'from-red-500 to-red-600';
        default:
          return 'from-hti-teal to-hti-navy';
      }
    };

    return (
      <div
        onClick={() => onApplicationClick(app)}
        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 overflow-hidden hover:scale-105 transform"
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${getCardAccentColor(app.status)}`} />

        {/* Card Content */}
        <div className="p-6">
          {/* Header with Status Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-hti-navy text-lg mb-2 leading-snug group-hover:text-hti-teal transition-colors truncate">
                {app.organizationName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                {app.is501c3 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    ✓ 501(c)(3)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Organization & Contact Info */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-700 font-medium">
              <span className="text-gray-500">Contact:</span> {app.contactPerson}
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-gray-500">Location:</span> {app.county || 'Unknown County'}
            </p>
          </div>

          {/* Key Stats - Chromebooks & Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-hti-teal/10 to-hti-navy/5 p-3 rounded-lg">
              <div className="text-xs text-gray-600 font-medium mb-1">Chromebooks</div>
              <div className="text-2xl font-bold text-hti-navy">{app.chromebooksNeeded}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 font-medium mb-1">Submitted</div>
              <div className="text-sm font-semibold text-gray-700">
                {new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Quote Section - if available */}
          {app.quote && (
            <div className="bg-gradient-to-br from-hti-teal/5 via-hti-navy/5 to-transparent p-4 rounded-xl border-l-4 border-hti-teal">
              <p className="text-sm text-hti-navy italic font-medium line-clamp-3 leading-relaxed">
                "{app.quote.substring(0, 140)}..."
              </p>
            </div>
          )}

          {/* Click Indicator */}
          <div className="mt-4 text-center text-xs text-gray-500 font-medium group-hover:text-hti-teal transition-colors">
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
      'Pending': 'from-yellow-100 to-yellow-50 border-yellow-200',
      'In Review': 'from-blue-100 to-blue-50 border-blue-200',
      'Approved': 'from-green-100 to-green-50 border-green-200',
      'Rejected': 'from-red-100 to-red-50 border-red-200'
    };
    return statusColors[group] || 'from-gray-100 to-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Group By Selector */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-hti-teal" />
          <label className="text-sm font-medium text-gray-700">Group by:</label>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupingOption['value'])}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hti-teal focus:border-transparent text-gray-900 bg-white"
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
            <div key={groupKey} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
              {/* Group Header with pizzazz */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={`w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r ${getGroupColor(groupKey)} hover:shadow-md transition-all border-b group cursor-pointer`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getGroupIcon(groupKey)}</span>
                  <div>
                    <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${
                      groupBy === 'status' ? getStatusColor(groupKey) : 'bg-hti-navy text-white'
                    }`}>
                      {groupKey}
                    </div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-white/70 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">
                      {groupApps.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700 font-medium">
                    {isCollapsed ? 'Show' : 'Hide'}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-gray-700 group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-gray-700 group-hover:-translate-y-1 transition-transform" />
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
          <div className="text-gray-400 mb-4">
            <Layers className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
