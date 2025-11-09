"use client";

import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Sparkles, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";

interface MetricsData {
  totalDevices: number;
  activePartnerships: number;
  devicesDeployed: number;
  grantFunded: number;
  avgMonthlyDevices: number;
  deploymentRate: number;
}

interface ImpactStats {
  devicesDeployed: number;
  familiesServed: number; // Estimate: 1 device = 2.5 family members on average
  co2Saved: number; // kg of CO2 saved by diverting e-waste from landfills
}

function calculateImpactStats(metrics: MetricsData | undefined): ImpactStats {
  const deployed = metrics?.devicesDeployed || 0;

  return {
    devicesDeployed: deployed,
    familiesServed: Math.round(deployed * 2.5), // Average household size
    co2Saved: Math.round(deployed * 47), // ~47kg CO2 per device recycled properly
  };
}

function AnimatedNumber({
  value,
  duration = 2000,
  suffix = "",
  prefix = ""
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateNumber = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);

      setDisplayed(current);

      if (now < endTime) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-sm"
            style={{
              backgroundColor: [
                '#F5BB2D', // HTI gold
                '#E67E50', // HTI orange
                '#F59E0B', // gold
                '#F9D71C', // HTI yellow
                '#1B365D', // HTI navy
              ][Math.floor(Math.random() * 4)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function LiveImpactCounter() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);

  const { data: metrics, isLoading } = useQuery<MetricsData>({
    queryKey: queryKeys.metrics,
    queryFn: async () => {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30s for live updates
  });

  const stats = calculateImpactStats(metrics);

  // Check for milestones
  useEffect(() => {
    const milestones = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000];
    const currentMilestone = milestones.findLast(m => stats.devicesDeployed >= m) || 0;

    if (currentMilestone > lastMilestone && lastMilestone !== 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    setLastMilestone(currentMilestone);
  }, [stats.devicesDeployed, lastMilestone]);

  if (isLoading) {
    return (
      <GlassCard className="relative overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-white/10 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-16 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="relative overflow-hidden">
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        <h3 className="text-lg font-semibold text-primary">
          Live Impact
        </h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Devices Deployed */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent-alt)]/15 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative bg-surface-alt backdrop-blur-sm rounded-lg p-4 border border-default hover:border-strong transition-all opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-xs text-secondary uppercase tracking-wider font-medium">
                Devices Deployed
              </span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              <AnimatedNumber value={stats.devicesDeployed} />
            </div>
            <div className="text-xs text-muted">
              Bridging the digital divide
            </div>
          </div>
        </div>

        {/* Families Served */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent-alt)]/15 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative bg-surface-alt backdrop-blur-sm rounded-lg p-4 border border-default hover:border-strong transition-all opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-xs text-secondary uppercase tracking-wider font-medium">
                Families Served
              </span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              <AnimatedNumber value={stats.familiesServed} />
            </div>
            <div className="text-xs text-muted">
              People connected to opportunity
            </div>
          </div>
        </div>

        {/* CO2 Saved */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative bg-surface-alt backdrop-blur-sm rounded-lg p-4 border border-default hover:border-strong transition-all opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-secondary uppercase tracking-wider font-medium">
                CO₂ Saved
              </span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              <AnimatedNumber value={stats.co2Saved} suffix=" kg" />
            </div>
            <div className="text-xs text-muted">
              E-waste diverted from landfills
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Message */}
      {showConfetti && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-warning border border-warning rounded-full animate-bounce">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">
              Milestone Reached: {lastMilestone.toLocaleString()} devices!
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
