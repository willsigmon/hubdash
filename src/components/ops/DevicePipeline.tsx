"use client";

import { useMemo } from "react";
import { useMetrics } from "@/lib/hooks/useMetrics";

interface PipelineStage {
  name: string;
  count: number;
  accent: "slate" | "navy" | "teal" | "orange" | "yellow" | "red";
  icon: string;
}

export default function DevicePipeline() {
  const { data, isLoading, isError } = useMetrics();

  const stages = useMemo<PipelineStage[]>(() => {
    const pipeline = data?.pipeline || {};

    return [
      { name: "Donated", count: pipeline.donated || 0, accent: "slate", icon: "📥" },
      { name: "Received", count: pipeline.received || 0, accent: "navy", icon: "✓" },
      { name: "Data Wipe", count: pipeline.dataWipe || 0, accent: "navy", icon: "🔒" },
      { name: "Refurbishing", count: pipeline.refurbishing || 0, accent: "orange", icon: "🔧" },
      { name: "QA Testing", count: pipeline.qaTesting || 0, accent: "yellow", icon: "🧪" },
      { name: "Ready", count: pipeline.ready || 0, accent: "teal", icon: "✅" },
      { name: "Distributed", count: pipeline.distributed || 0, accent: "orange", icon: "🎯" },
        ];
  }, [data]);

  const summary = useMemo(() => {
    const total = stages.reduce((sum, stage) => sum + stage.count, 0);
    const distributed = data?.pipeline?.distributed || 0;
        const completionRate = total > 0 ? Math.round((distributed / total) * 100) : 0;
    const bottleneck = stages.slice(0, -1).reduce((max, stage) => Math.max(max, stage.count), 0);

    return {
          total,
          completionRate,
          avgCycleTime: "4.2d", // TODO: Calculate from actual data
      bottleneck,
    };
  }, [data?.pipeline?.distributed, stages]);

  if (isLoading) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg h-24" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-hti-yellow/40">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-hti-red/40 shadow-xl p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">📊 Device Pipeline</h3>
        <p className="text-hti-yellow">We couldn’t load the latest pipeline data. Try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--subtle shadow-glass p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-glass-bright flex items-center gap-2">
            📊 Device Pipeline
          </h3>
          <p className="text-sm text-glass-muted mt-1">
            Live snapshot of every laptop moving through HTI’s refurbishment journey.
          </p>
        </div>
        <div className="glass-chip glass-chip--slate text-xs md:text-sm">
          {summary.total} devices in motion
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-glass-muted">Pipeline completion</span>
          <span className="text-glass-bright font-semibold">{summary.completionRate}%</span>
        </div>
        <div className="glass-track">
          <div
            className="glass-track__fill"
            style={{ width: `${Math.max(4, Math.min(100, summary.completionRate))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] tracking-[0.2em] text-glass-muted">
          <span>Start</span>
          <span>Mid</span>
          <span>Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
          {stages.map((stage, index) => (
          <div key={stage.name} className="flex flex-col gap-3">
            <div
              className={`glass-card glass-card--subtle px-4 py-5 text-center transition-transform duration-300 hover:-translate-y-1 ${
                stage.count === summary.bottleneck && stage.name !== "Distributed" ? "ring-2 ring-hti-yellow/60" : ""
              } ${index === stages.length - 1 ? "lg:col-span-1" : ""}`}
            >
              <div className={`glass-card__glow bg-gradient-to-br ${
                stage.accent === "teal"
                  ? "from-hti-teal to-hti-teal-light"
                  : stage.accent === "orange"
                  ? "from-hti-orange to-hti-orange-yellow"
                  : stage.accent === "yellow"
                  ? "from-hti-yellow to-hti-yellow-light"
                  : stage.accent === "navy"
                  ? "from-hti-navy to-hti-navy-dark"
                  : "from-hti-sand to-hti-fog"
              }`} />
              <div className="relative space-y-2">
                <div className="text-3xl">{stage.icon}</div>
                <div className="text-2xl font-bold text-glass-bright">{stage.count}</div>
                <div className="text-xs font-semibold text-glass-muted tracking-wide">
                  {stage.name}
                </div>
              </div>
            </div>
              {index < stages.length - 1 && (
              <div className="hidden lg:block text-center text-glass-muted">→</div>
              )}
            </div>
          ))}
        </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t glass-divider">
        <div className="glass-card glass-card--subtle px-4 py-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-glass-bright">{summary.total}</div>
          <div className="text-xs md:text-sm text-glass-muted mt-1">Total in Pipeline</div>
        </div>
        <div className="glass-card glass-card--subtle px-4 py-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-glass-bright">{summary.completionRate}%</div>
          <div className="text-xs md:text-sm text-glass-muted mt-1">Completion Rate</div>
        </div>
        <div className="glass-card glass-card--subtle px-4 py-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-glass-bright">{summary.avgCycleTime}</div>
          <div className="text-xs md:text-sm text-glass-muted mt-1">Avg Cycle Time</div>
        </div>
        <div className="glass-card glass-card--subtle px-4 py-4 text-center">
          <div className="text-xl md:text-2xl font-bold text-glass-bright">{summary.bottleneck}</div>
          <div className="text-xs md:text-sm text-glass-muted mt-1">Current Bottleneck</div>
        </div>
      </div>
    </div>
  );
}
