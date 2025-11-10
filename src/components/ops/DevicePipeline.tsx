"use client";

import { useEffect, useState } from "react";

interface PipelineStage {
  name: string;
  count: number;
  icon: string;
  statusKey: string;
}

export default function DevicePipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [stats, setStats] = useState({ total: 0, completionRate: 0, avgCycleTime: "0d", bottleneck: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        const pipeline = data?.pipeline || {};
        const stagesData: PipelineStage[] = [
          { name: "Donated", count: pipeline.donated || 0, icon: "📥", statusKey: "donated" },
          { name: "Received", count: pipeline.received || 0, icon: "✓", statusKey: "received" },
          { name: "Data Wipe", count: pipeline.dataWipe || 0, icon: "🔒", statusKey: "data_wipe" },
          { name: "Refurbishing", count: pipeline.refurbishing || 0, icon: "🔧", statusKey: "refurbishing" },
          { name: "QA Testing", count: pipeline.qaTesting || 0, icon: "🧪", statusKey: "qa_testing" },
          { name: "Ready", count: pipeline.ready || 0, icon: "✅", statusKey: "ready" },
          { name: "Distributed", count: pipeline.distributed || 0, icon: "🎯", statusKey: "distributed" },
        ];

        const total = stagesData.reduce((sum, stage) => sum + stage.count, 0);
        const distributed = pipeline.distributed || 0;
        const completionRate = total > 0 ? Math.round((distributed / total) * 100) : 0;
        const bottleneck = Math.max(...stagesData.slice(0, -1).map(s => s.count));

        setStages(stagesData);
        setStats({ total, completionRate, avgCycleTime: "4.2d", bottleneck });
      })
      .catch(error => {
        console.error('Error fetching pipeline data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const stageColorClasses: Record<string, string> = {
    donated: "bg-soft-accent text-accent border-accent/30",
    received: "bg-soft-accent text-accent border-accent/30",
    data_wipe: "bg-soft-accent text-accent border-accent/30",
    refurbishing: "bg-soft-warning text-warning border-warning/30",
    qa_testing: "bg-soft-warning text-warning border-warning/30",
    ready: "bg-soft-success text-success border-success/30",
    distributed: "bg-soft-success text-success border-success/30",
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-xl border border-default shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-surface-alt rounded-lg h-24" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-default">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-alt rounded h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-default shadow p-4 md:p-6">
      {/* Header */}
      <h3 className="text-2xl font-bold text-primary mb-8">📊 Device Pipeline</h3>

      {/* Pipeline Flow - Responsive */}
      <div className="mb-8">
        <div className="hidden lg:grid grid-cols-7 gap-2 mb-6">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div className={`${stageColorClasses[stage.statusKey]} rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 border`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{stage.icon}</div>
                  <div className="text-2xl font-bold mb-1 text-primary">{stage.count}</div>
                  <div className="text-xs font-semibold text-primary">{stage.name}</div>
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <div className="text-accent text-2xl font-bold">→</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile/Tablet view - Responsive grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((stage) => (
              <div key={stage.name} className={`${stageColorClasses[stage.statusKey]} rounded-lg p-3 text-center hover:shadow transition-all cursor-pointer border`}>
                <div className="text-2xl mb-1">{stage.icon}</div>
                <div className="text-xl font-bold mb-0.5 text-primary">{stage.count}</div>
                <div className="text-xs font-semibold text-primary">{stage.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-6 border-t border-default">
        <div className="text-center p-4 bg-surface-alt rounded-lg border border-default">
          <div className="text-xl md:text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-xs md:text-sm text-secondary font-medium mt-1">Total in Pipeline</div>
        </div>
        <div className="text-center p-4 bg-soft-success rounded-lg border border-success/30">
          <div className="text-xl md:text-2xl font-bold text-success">{stats.completionRate}%</div>
          <div className="text-xs md:text-sm text-success font-medium mt-1">Completion Rate</div>
        </div>
        <div className="text-center p-4 bg-soft-warning rounded-lg border border-warning/30">
          <div className="text-xl md:text-2xl font-bold text-warning">{stats.avgCycleTime}</div>
          <div className="text-xs md:text-sm text-warning font-medium mt-1">Avg Cycle Time</div>
        </div>
        <div className="text-center p-4 bg-soft-accent rounded-lg border border-accent/30">
          <div className="text-xl md:text-2xl font-bold text-accent">{stats.bottleneck}</div>
          <div className="text-xs md:text-sm text-accent font-medium mt-1">Bottleneck</div>
        </div>
      </div>
    </div>
  );
}
