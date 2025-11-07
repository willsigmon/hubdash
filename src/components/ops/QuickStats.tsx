"use client";

import { useMemo } from "react";
import { useMetrics } from "@/lib/hooks/useMetrics";
import EmptyState from "@/components/ui/EmptyState";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  gradient: string;
}

export default function QuickStats() {
  const { data, isLoading, isError } = useMetrics();

  const stats = useMemo<Stat[]>(() => {
    if (!data) return [];

    return [
      {
        label: "In Pipeline",
        value: String(data.inPipeline || 0),
        change: "+12 today",
        trend: "up",
        icon: "🔄",
        gradient: "from-hti-yellow to-hti-yellow-light",
      },
      {
        label: "Ready to Ship",
        value: String(data.readyToShip || 0),
        change: "8 scheduled",
        trend: "neutral",
        icon: "✅",
        gradient: "from-hti-orange-yellow to-hti-yellow",
      },
      {
        label: "Partner Orgs",
        value: String(data.partnerOrganizations || 0),
        change: "+2 this quarter",
        trend: "neutral",
        icon: "🤝",
        gradient: "from-hti-teal to-hti-teal-light",
      },
      {
        label: "Avg Turnaround",
        value: "4.2d",
        change: "-0.8d vs last week",
        trend: "down",
        icon: "⚡",
        gradient: "from-hti-teal to-hti-sky",
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card glass-card--subtle h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<span role="img" aria-label="warning">⚠️</span>}
        title="We couldn’t load the latest quick stats"
        description="Your data is cached safely. Once the connection is back, these numbers will refresh automatically."
        actionLabel="Try again"
        onAction={() => window.location.reload()}
        tone="warning"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card glass-card--subtle border border-white/25 group transition-transform duration-300 hover:-translate-y-1"
        >
          <div className={`glass-card__glow bg-gradient-to-br ${stat.gradient}`} />

          <div className="relative p-5 md:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform origin-left">
                {stat.icon}
              </div>
              <div className="flex-shrink-0">
                {stat.trend === "up" && (
                  <span className="glass-chip glass-chip--yellow text-xs">⬆ Up</span>
                )}
                {stat.trend === "down" && (
                  <span className="glass-chip glass-chip--red text-xs">⬇ Down</span>
                )}
                {stat.trend === "neutral" && (
                  <span className="glass-chip glass-chip--slate text-xs">⏸ Steady</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-3xl md:text-4xl font-bold text-hti-navy mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-hti-plum/80">
                {stat.label}
              </div>
            </div>

            <div className="glass-chip glass-chip--slate text-xs">
              {stat.change}
            </div>
          </div>

          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
        </div>
      ))}
    </div>
  );
}
