"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/utils/date-formatters";
import { getActivityTypeColor } from "@/lib/utils/status-colors";

interface Activity {
  id: string;
  user_name: string;
  action: string;
  target: string;
  type: "success" | "warning" | "info";
  icon: string;
  created_at: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activity:', error);
        setLoading(false);
      });

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetch('/api/activity')
        .then(res => res.json())
        .then(data => setActivities(data))
        .catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Live Updates</span>
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="bg-gray-700 h-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-5 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-gray-300">Live Updates</span>
        </div>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          Clear All
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl md:text-5xl mb-3">📭</div>
              <p className="text-xs md:text-sm">No recent activity</p>
            </div>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 md:p-5 border-l-4 transition-all hover:bg-gray-750 ${getActivityTypeColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg md:text-xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">{activity.user_name}</span>
                    <span className="text-gray-400"> {activity.action} </span>
                    <span className="text-hti-teal font-medium break-words">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
