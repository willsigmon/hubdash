"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  user_name: string;
  action: string;
  target: string;
  type: "success" | "warning" | "info";
  icon: string;
  created_at: string;
}

const typeColors = {
  success: "border-green-500/30 bg-green-500/5",
  warning: "border-orange-500/30 bg-orange-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Live Updates</span>
        </div>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          Clear All
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 border-l-2 ${typeColors[activity.type]} hover:bg-gray-750 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">{activity.user_name}</span>
                    {' '}{activity.action}{' '}
                    <span className="text-hti-teal">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
