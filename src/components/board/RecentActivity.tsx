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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-hti-fig/10">
      <div className="p-6 bg-gradient-to-r from-hti-plum/8 to-hti-ember/8 border-b border-hti-fig/10">
        <h3 className="text-xl font-bold text-hti-plum flex items-center gap-2 mb-1">
          🚀 Recent Activity
        </h3>
        <p className="text-sm text-hti-stone font-medium">
          Real-time updates from HTI operations
        </p>
      </div>

      <div className="divide-y divide-hti-fig/10">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-hti-sand rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-hti-sand rounded w-3/4 mb-2" />
                  <div className="h-3 bg-hti-sand rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-hti-stone/60">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No recent activity yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gradient-to-r hover:from-hti-sand/60 hover:to-hti-soleil/10 transition-all group"
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
                      <h3 className="text-base font-bold text-hti-plum mb-1 group-hover:text-hti-ember transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-hti-stone">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-hti-plum whitespace-nowrap px-3 py-1.5 bg-hti-gold/15 rounded-full border border-hti-gold/40 group-hover:bg-hti-ember/15 group-hover:border-hti-ember/40 transition-all">
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
      <div className="p-4 bg-hti-sand border-t border-hti-fig/10">
        <button className="w-full text-center text-sm font-bold text-hti-plum hover:text-hti-ember transition-colors flex items-center justify-center gap-2">
          <span>View All Activity</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
