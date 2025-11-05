"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: "donation" | "distribution" | "partnership" | "milestone";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export default function RecentActivity() {
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
        console.error('Error loading activity:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-hti-navy/5 to-hti-teal/5 border-b border-hti-teal/20">
        <h3 className="text-xl font-bold text-hti-navy flex items-center gap-2 mb-1">
          🚀 Recent Activity
        </h3>
        <p className="text-sm text-gray-600">
          Real-time updates from HTI operations
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No recent activity yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gradient-to-r hover:from-hti-teal/5 hover:to-transparent transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Icon with better styling */}
                <div className={`${activity.color} text-white p-3 rounded-xl text-2xl flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-hti-navy transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-gray-700 whitespace-nowrap px-2.5 py-1 bg-gray-100 rounded-full group-hover:bg-hti-teal/10 transition-colors">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <button className="w-full text-center text-sm font-semibold text-hti-teal hover:text-hti-navy transition-colors flex items-center justify-center gap-2">
          <span>View All Activity</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
