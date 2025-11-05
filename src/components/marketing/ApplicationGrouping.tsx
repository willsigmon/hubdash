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
      const statusOrder = { 'Pending': 0, 'In Review': 1, 'Approved': 2, 'Rejected': 3 };
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

  const ApplicationCard = ({ app }: { app: Partnership }) => (
    <div
      onClick={() => onApplicationClick(app)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-hti-teal p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-hti-navy text-lg mb-1">
            {app.organizationName}
          </h4>
          <p className="text-sm text-gray-600">
            {app.contactPerson} • {app.county}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold border shrink-0 ${getStatusColor(app.status)}`}>
          {app.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm mb-3">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Chromebooks:</span>
          <span className="font-semibold text-hti-navy">{app.chromebooksNeeded}</span>
        </div>
        {app.is501c3 && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
            501(c)(3)
          </span>
        )}
        <span className="text-gray-500 text-xs ml-auto">
          {new Date(app.timestamp).toLocaleDateString()}
        </span>
      </div>

      {app.quote && (
        <div className="bg-gradient-to-br from-hti-teal/5 to-hti-navy/5 p-3 rounded-lg border-l-2 border-hti-teal">
          <p className="text-xs text-gray-700 italic line-clamp-2">
            "{app.quote.substring(0, 120)}..."
          </p>
        </div>
      )}
    </div>
  );

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
                  <span className="text-xs text-gray-500 font-medium">
                    {isCollapsed ? 'Show' : 'Hide'}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-gray-600 group-hover:-translate-y-1 transition-transform" />
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
