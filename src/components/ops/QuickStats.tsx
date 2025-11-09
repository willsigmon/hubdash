"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        const statsData: Stat[] = [
          {
            label: "In Pipeline",
            value: String(data.inPipeline || 0),
            change: "+12 today",
            trend: "up",
            icon: "🔄",
          },
          {
            label: "Ready to Ship",
            value: String(data.readyToShip || 0),
            change: "8 scheduled",
            trend: "neutral",
            icon: "✅",
          },
          {
            label: "Pending Pickup",
            value: String(data.pendingPickups || 0),
            change: "5 urgent",
            trend: "up",
            icon: "📍",
          },
          {
            label: "Avg Turnaround",
            value: "4.2d",
            change: "-0.8d vs last week",
            trend: "down",
            icon: "⚡",
          },
        ];

        setStats(statsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-alt rounded-xl h-32 animate-pulse border border-default" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl bg-surface-alt border border-default shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 accent-gradient opacity-10 group-hover:opacity-15 transition-opacity" />

          {/* Content */}
          <div className="relative p-4">
            {/* Header with Icon and Trend */}
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl group-hover:scale-110 transition-transform origin-left">{stat.icon}</div>
              <div className="flex-shrink-0">
                {stat.trend === "up" && (
                  <div className="flex items-center gap-1 text-success text-xs font-bold bg-soft-success px-2 py-1 rounded-full border border-success">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 5.293l5.354-5.354a1 1 0 011.414 1.414L13.414 7l5.354 5.354a1 1 0 01-1.414 1.414L12 8.414l-5.354 5.354a1 1 0 11-1.414-1.414L10.586 7 5.232 1.646a1 1 0 111.414-1.414L12 5.293z" clipRule="evenodd" />
                    </svg>
                    Up
                  </div>
                )}
                {stat.trend === "down" && (
                  <div className="flex items-center gap-1 text-danger text-xs font-bold bg-soft-danger px-2 py-1 rounded-full border border-danger">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 15.707l5.354 5.354a1 1 0 001.414-1.414L13.414 15l5.354-5.354a1 1 0 10-1.414-1.414L12 13.586l-5.354-5.354a1 1 0 10-1.414 1.414L10.586 15l-5.354 5.354a1 1 0 001.414 1.414L12 15.707z" clipRule="evenodd" />
                    </svg>
                    Down
                  </div>
                )}
                {stat.trend === "neutral" && (
                  <div className="flex items-center gap-1 text-accent text-xs font-bold bg-soft-accent px-2 py-1 rounded-full border border-accent">
                    ⏸
                  </div>
                )}
              </div>
            </div>

            {/* Main Value and Label */}
            <div className="mb-2">
              <div className="text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-secondary">
                {stat.label}
              </div>
            </div>

            {/* Change Indicator */}
            <div className="text-[10px] text-primary bg-surface-alt border border-default rounded px-2 py-1 inline-block font-semibold">
              {stat.change}
            </div>
          </div>

          {/* Bottom Accent Bar */}
          <div className="h-2 accent-gradient group-hover:opacity-100 opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
