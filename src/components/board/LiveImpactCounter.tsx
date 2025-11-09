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
    <div className="relative overflow-hidden">
      <Confetti show={showConfetti} />

      {/* Header - Enhanced */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            Live Impact Counter
          </h3>
          <p className="text-sm font-medium text-secondary">
            Real-time metrics updating every 30 seconds
          </p>
        </div>
        <span className="rounded-full border-2 border-accent bg-soft-accent px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">
          Live
        </span>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Devices Deployed - Enhanced */}
        <div className="group relative">
          <div className="absolute inset-0 accent-gradient opacity-10 group-hover:opacity-20 rounded-xl blur-xl transition-all" />
          <div className="relative rounded-xl border-2 border-default bg-surface p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg accent-gradient">
                <Zap className="w-5 h-5 text-on-accent" />
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Devices Deployed
              </span>
            </div>
            <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              <AnimatedNumber value={stats.devicesDeployed} />
            </div>
            <div className="text-xs font-medium text-secondary">
              Bridging the digital divide
            </div>
          </div>
        </div>

        {/* Families Served - Enhanced */}
        <div className="group relative">
          <div className="absolute inset-0 accent-gradient opacity-10 group-hover:opacity-20 rounded-xl blur-xl transition-all" />
          <div className="relative rounded-xl border-2 border-default bg-surface p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg accent-gradient">
                <Users className="w-5 h-5 text-on-accent" />
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Families Served
              </span>
            </div>
            <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              <AnimatedNumber value={stats.familiesServed} />
            </div>
            <div className="text-xs font-medium text-secondary">
              People connected to opportunity
            </div>
          </div>
        </div>

        {/* CO2 Saved - Enhanced */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl blur-xl group-hover:opacity-20 transition-all" />
          <div className="relative rounded-xl border-2 border-default bg-surface p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-success/50 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                CO₂ Saved
              </span>
            </div>
            <div className="text-4xl font-bold text-success mb-2 group-hover:text-success/80 transition-colors">
              <AnimatedNumber value={stats.co2Saved} suffix=" kg" />
            </div>
            <div className="text-xs font-medium text-secondary">
              E-waste diverted from landfills
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Message */}
      {showConfetti && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-warning border border-warning rounded-full animate-bounce">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">
              Milestone Reached: {lastMilestone.toLocaleString()} devices!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
