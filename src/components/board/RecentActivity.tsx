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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-hti-yellow/50">
      <div className="p-6 bg-gradient-to-r from-hti-navy/5 to-hti-red/5 border-b border-hti-yellow/50">
        <h3 className="text-xl font-bold text-hti-navy flex items-center gap-2 mb-1">
          🚀 Recent Activity
        </h3>
        <p className="text-sm text-hti-gray font-medium">
          Real-time updates from HTI operations
        </p>
      </div>

      <div className="divide-y divide-hti-yellow/10">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-hti-gray-light rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-hti-gray-light rounded w-3/4 mb-2" />
                  <div className="h-3 bg-hti-gray-light rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-hti-gray/50">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No recent activity yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gradient-to-r hover:from-hti-yellow/5 hover:to-hti-red/5 transition-all group"
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
                      <h3 className="text-base font-bold text-hti-navy mb-1 group-hover:text-hti-red transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-hti-gray">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-hti-navy whitespace-nowrap px-3 py-1.5 bg-hti-yellow/20 rounded-full border border-hti-yellow/50 group-hover:bg-hti-red/20 group-hover:border-hti-red/40 transition-all">
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
      <div className="p-4 bg-hti-gray-light border-t border-hti-yellow/50">
        <button className="w-full text-center text-sm font-bold text-hti-red hover:text-hti-orange transition-colors flex items-center justify-center gap-2">
          <span>View All Activity</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
