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
            change: "+12 today",
            trend: "up",
            icon: "🔄",
            color: "from-hti-yellow to-hti-yellow-bright",
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
            color: "from-hti-red to-hti-orange",
          },
          {
            label: "Avg Turnaround",
            value: "4.2d",
            change: "-0.8d vs last week",
            trend: "down",
            icon: "⚡",
            color: "from-hti-orange to-hti-yellow",
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
          <div key={i} className="bg-white/5 rounded-xl h-32 animate-pulse border border-hti-yellow/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-hti-yellow/50 shadow-xl hover:shadow-2xl hover:border-hti-red/70 transition-all duration-300 hover:scale-105 group"
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-15 transition-opacity`} />

          {/* Content */}
          <div className="relative p-5 md:p-6">
            {/* Header with Icon and Trend */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform origin-left">{stat.icon}</div>
              <div className="flex-shrink-0">
                {stat.trend === "up" && (
                  <div className="flex items-center gap-1 text-hti-yellow text-xs font-bold bg-hti-yellow/30 px-2 py-1 rounded-full border border-hti-yellow/60">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 5.293l5.354-5.354a1 1 0 011.414 1.414L13.414 7l5.354 5.354a1 1 0 01-1.414 1.414L12 8.414l-5.354 5.354a1 1 0 11-1.414-1.414L10.586 7 5.232 1.646a1 1 0 111.414-1.414L12 5.293z" clipRule="evenodd" />
                    </svg>
                    Up
                  </div>
                )}
                {stat.trend === "down" && (
                  <div className="flex items-center gap-1 text-hti-red text-xs font-bold bg-hti-red/30 px-2 py-1 rounded-full border border-hti-red/60">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 15.707l5.354 5.354a1 1 0 001.414-1.414L13.414 15l5.354-5.354a1 1 0 10-1.414-1.414L12 13.586l-5.354-5.354a1 1 0 10-1.414 1.414L10.586 15l-5.354 5.354a1 1 0 001.414 1.414L12 15.707z" clipRule="evenodd" />
                    </svg>
                    Down
                  </div>
                )}
                {stat.trend === "neutral" && (
                  <div className="flex items-center gap-1 text-hti-yellow text-xs font-bold bg-hti-yellow/30 px-2 py-1 rounded-full border border-hti-yellow/60">
                    ⏸
                  </div>
                )}
              </div>
            </div>

            {/* Main Value and Label */}
            <div className="mb-3">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-hti-yellow transition-colors">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-bold text-hti-yellow">
                {stat.label}
              </div>
            </div>

            {/* Change Indicator */}
            <div className="text-xs md:text-xs text-hti-yellow bg-hti-yellow/20 rounded px-3 py-1.5 inline-block font-bold border border-hti-yellow/60">
              {stat.change}
            </div>
          </div>

          {/* Bottom Accent Bar */}
          <div className={`h-2 bg-gradient-to-r ${stat.color} group-hover:opacity-100 opacity-70 transition-opacity`} />
        </div>
      ))}
    </div>
  );
}
