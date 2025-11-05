"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
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
            change: "+12 today", // TODO: Calculate from actual data
            trend: "up",
            icon: "🔄",
            color: "from-blue-600 to-blue-400",
          },
          {
            label: "Ready to Ship",
            value: String(data.readyToShip || 0),
            change: "8 scheduled",
            trend: "neutral",
            icon: "✅",
            color: "from-green-600 to-green-400",
          },
          {
            label: "Pending Pickup",
            value: String(data.pendingPickups || 0),
            change: "5 urgent",
            trend: "up",
            icon: "📍",
            color: "from-orange-600 to-orange-400",
          },
          {
            label: "Avg Turnaround",
            value: "4.2d", // TODO: Calculate from actual data
            change: "-0.8d vs last week",
            trend: "down",
            icon: "⚡",
            color: "from-purple-600 to-purple-400",
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
          <div key={i} className="bg-gray-800 rounded-xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{stat.icon}</div>
              {stat.trend === "up" && (
                <div className="text-green-400 text-xs font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              )}
              {stat.trend === "down" && (
                <div className="text-red-400 text-xs font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-400">
                {stat.label}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {stat.change}
            </div>
          </div>

          <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
        </div>
      ))}
    </div>
  );
}
