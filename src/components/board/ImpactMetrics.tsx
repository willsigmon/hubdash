"use client";

import { useEffect, useMemo, useState } from "react";
import { useMetrics } from "@/lib/hooks/useMetrics";
import EmptyState from "@/components/ui/EmptyState";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  description: string;
  isFeatured?: boolean;
  progress?: number;
}

export default function ImpactMetrics() {
  const { data, isLoading, isError } = useMetrics();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);

  const metricsData = useMemo<Metric[]>(() => {
    if (!data) return [];

    const grantProgress = Math.round(
      ((data.grantLaptopsPresented || 0) / Math.max(data.grantLaptopGoal || 1500, 1)) * 100
    );

    return [
      {
        label: "Grant Laptops Presented",
        value: data.grantLaptopsPresented || 0,
        suffix: ` / 1,500`,
        icon: "🎯",
        color: "from-hti-teal to-hti-teal-light",
        description: "Since Sept 9, 2024 (Grant Period)",
        isFeatured: true,
        progress: grantProgress,
      },
      {
        label: "Total Laptops (All-Time)",
        value: data.totalLaptopsCollected || 0,
        suffix: "+",
        icon: "💻",
        color: "from-hti-navy to-hti-teal",
        description: "Overall collection since inception",
      },
      {
        label: "Counties Served",
        value: data.countiesServed || 0,
        suffix: "",
        icon: "📍",
        color: "from-hti-yellow to-hti-yellow-light",
        description: "Through Digital Champion Grant",
      },
      {
        label: "People Trained",
        value: data.peopleTrained || 0,
        suffix: "+",
        icon: "👥",
        color: "from-hti-teal to-hti-sky",
        description: "Digital literacy participants",
      },
      {
        label: "E-Waste Diverted",
        value: data.eWasteTons || 0,
        suffix: " tons",
        icon: "♻️",
        color: "from-hti-navy-dark to-hti-fog",
        description: "Kept out of landfills",
      },
      {
        label: "Partner Organizations",
        value: data.partnerOrganizations || 0,
        suffix: "",
        icon: "🤝",
        color: "from-hti-teal-dark to-hti-teal",
        description: "Community collaborations",
      },
    ];
  }, [data]);

  useEffect(() => {
    if (!metricsData.length) return;

    setMetrics(metricsData);
    setAnimatedValues(metricsData.map(() => 0));
    setAnimatedProgress(0);
  }, [metricsData]);

  useEffect(() => {
    if (metrics.length === 0) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    const timers: NodeJS.Timeout[] = [];

    metrics.forEach((metric, index) => {
      let currentStep = 0;
      const increment = metric.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValues((prev) => {
          const next = [...prev];
          next[index] = Math.min(Math.floor(increment * currentStep), metric.value);
          return next;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);

      timers.push(timer);
    });

    const grant = metrics[0];
    if (grant?.progress !== undefined) {
      let currentStep = 0;
      const increment = grant.progress / steps;

      const progressTimer = setInterval(() => {
        currentStep++;
        setAnimatedProgress(
          Math.min(Math.floor(increment * currentStep), grant.progress || 0)
        );

        if (currentStep >= steps) {
          clearInterval(progressTimer);
        }
      }, interval);

      timers.push(progressTimer);
    }

    return () => timers.forEach((timer) => clearInterval(timer));
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-card glass-card--subtle h-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card glass-card--subtle h-44 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<span role="img" aria-label="metrics">📊</span>}
        title="Impact metrics are taking a pause"
        description="We’re under the Knack rate limit umbrella at the moment. Your last synced numbers will return automatically."
        actionLabel="Refresh"
        onAction={() => window.location.reload()}
        tone="warning"
      />
    );
  }

  const featuredMetric = metrics[0];
  const otherMetrics = metrics.slice(1);

  return (
    <div className="space-y-8">
      {featuredMetric && (
        <div className="glass-card glass-card--subtle shadow-glass overflow-hidden group">
          <div className={`glass-card__glow bg-gradient-to-br ${featuredMetric.color}`} />
          <div className="relative p-8 md:p-10 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{featuredMetric.icon}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-glass-bright">
                    {featuredMetric.label}
                  </h3>
                  <p className="text-sm text-glass-muted mt-1 font-medium">
                    {featuredMetric.description}
                  </p>
                </div>
              </div>
              <span className="glass-chip glass-chip--teal text-sm whitespace-nowrap">
                {animatedProgress}% complete
              </span>
            </div>

            <div className="glass-card glass-card--subtle shadow-glass p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <div className="text-5xl md:text-6xl font-bold text-glass-bright">
                  {animatedValues[0]?.toLocaleString() || 0}
                </div>
                <span className="text-2xl font-bold text-glass-muted">{featuredMetric.suffix}</span>
              </div>
              <p className="text-sm text-glass-muted font-medium">
                Goal: 1,500 laptops by end of grant period
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-glass-bright">Grant Progress</span>
                <span className="text-sm font-bold text-glass-muted">{animatedProgress}%</span>
              </div>
              <div className="glass-track">
                <div
                  className="glass-track__fill"
                  style={{ width: `${Math.max(animatedProgress, 1)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-glass-muted font-semibold mt-4 pt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="-mx-1 md:mx-0 overflow-x-auto pb-2">
        <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(220px,1fr)] md:auto-cols-[minmax(240px,1fr)] lg:auto-cols-[minmax(260px,1fr)] gap-4 md:gap-6 px-1 md:px-0">
          {otherMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="glass-card glass-card--subtle shadow-glass group transition-transform duration-300 hover:-translate-y-1 min-h-[220px] flex-shrink-0"
            >
              <div className={`glass-card__glow bg-gradient-to-br ${metric.color}`} />
              <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-5xl drop-shadow-[0_8px_22px_rgba(8,25,55,0.4)]">{metric.icon}</div>
                  <span className="glass-chip glass-chip--slate text-xs">Live</span>
                </div>
                <div>
                  <div className="text-4xl font-bold text-glass-bright mb-1">
                    {animatedValues[index + 1]?.toLocaleString() || 0}
                    <span className="text-2xl font-bold text-glass-muted ml-1">
                      {metric.suffix}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-glass-muted opacity-90">
                    {metric.label}
                  </h4>
                </div>
                <p className="text-xs text-glass-muted leading-relaxed font-medium">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
