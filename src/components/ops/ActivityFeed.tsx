"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/utils/date-formatters";
import { getActivityTypeColor } from "@/lib/utils/status-colors";
import EmptyState from "@/components/ui/EmptyState";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activity:', err);
        setError(err instanceof Error ? err.message : 'Unable to load activity feed');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
        <div className="p-4 glass-divider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-hti-yellow rounded-full animate-pulse" />
            <span className="text-sm font-bold text-glass-bright">Live Updates</span>
          </div>
        </div>
        <div className="divide-y divide-white/10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="bg-white/10 h-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<span role="img" aria-label="satellite">🛰️</span>}
        title="Activity feed is offline"
        description="We’ll pick back up as soon as Knack lets us reconnect. All live updates resume automatically."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
        tone="warning"
      />
    );
  }

  const isPlaceholderFeed =
    activities.length === 1 &&
    activities[0]?.user_name === 'HTI System' &&
    activities[0]?.action === 'loaded data from' &&
    activities[0]?.target === 'Knack database';

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-5 glass-divider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-hti-yellow rounded-full animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-glass-bright">Live Updates</span>
        </div>
        <button
          className="glass-button text-xs md:text-sm"
          aria-label="Clear all activity notifications"
        >
          Clear All
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/10">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center text-glass-muted py-8">
              <div className="text-4xl md:text-5xl mb-3">📭</div>
              <p className="text-xs md:text-sm font-medium">No recent activity</p>
            </div>
          </div>
        ) : isPlaceholderFeed ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center text-glass-muted py-10 px-6">
              <div className="text-4xl md:text-5xl mb-3">🛰️</div>
              <p className="text-sm md:text-base font-bold text-glass-bright">Live activity stream coming soon</p>
              <p className="text-xs md:text-sm mt-2 text-glass-muted">
                We’re wiring HUBDash to Knack webhooks so you’ll see updates the moment they happen.
              </p>
            </div>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 md:p-5 border-l-4 transition-all hover:bg-white/5 ${getActivityTypeColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg md:text-xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-glass-muted leading-relaxed">
                    <span className="font-bold text-glass-bright">{activity.user_name}</span>
                    <span className="text-glass-muted"> {activity.action} </span>
                    <span className="text-glass-bright font-bold break-words">{activity.target}</span>
                  </p>
                  <p className="text-xs text-glass-muted mt-2 font-medium">{formatTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
