"use client";

import { useEffect, useState } from "react";

interface PipelineStage {
  name: string;
  count: number;
  color: string;
  icon: string;
}

export default function DevicePipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [stats, setStats] = useState({ total: 0, completionRate: 0, avgCycleTime: "0d", bottleneck: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        const pipeline = data.pipeline || {};

        const stagesData: PipelineStage[] = [
          { name: "Donated", count: pipeline.donated || 0, color: "bg-hti-gray", icon: "📥" },
          { name: "Received", count: pipeline.received || 0, color: "bg-hti-navy", icon: "✓" },
          { name: "Data Wipe", count: pipeline.dataWipe || 0, color: "bg-hti-navy/80", icon: "🔒" },
          { name: "Refurbishing", count: pipeline.refurbishing || 0, color: "bg-hti-orange", icon: "🔧" },
          { name: "QA Testing", count: pipeline.qaTesting || 0, color: "bg-hti-yellow", icon: "🧪" },
          { name: "Ready", count: pipeline.ready || 0, color: "bg-green-600", icon: "✅" },
          { name: "Distributed", count: pipeline.distributed || 0, color: "bg-hti-red", icon: "🎯" },
        ];

        const total = stagesData.reduce((sum, stage) => sum + stage.count, 0);
        const distributed = pipeline.distributed || 0;
        const completionRate = total > 0 ? Math.round((distributed / total) * 100) : 0;

        // Find bottleneck (highest count excluding distributed)
        const bottleneck = Math.max(...stagesData.slice(0, -1).map(s => s.count));

        setStages(stagesData);
        setStats({
          total,
          completionRate,
          avgCycleTime: "4.2d", // TODO: Calculate from actual data
          bottleneck
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pipeline data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-hti-yellow/20 shadow-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg h-24" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-hti-yellow/10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-hti-yellow/20 shadow-xl p-4 md:p-6">
      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-8">📊 Device Pipeline</h3>

      {/* Pipeline Flow - Responsive */}
      <div className="mb-8">
        <div className="hidden lg:grid grid-cols-7 gap-2 mb-6">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative">
              {/* Stage Card - Desktop */}
              <div className={`${stage.color} rounded-lg p-4 text-white hover:shadow-2xl transition-all cursor-pointer transform hover:scale-110 border-2 border-white/20`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{stage.icon}</div>
                  <div className="text-2xl font-bold mb-1">{stage.count}</div>
                  <div className="text-xs font-bold opacity-100">{stage.name}</div>
                </div>
              </div>

              {/* Arrow - Desktop only */}
              {index < stages.length - 1 && (
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <div className="text-hti-yellow text-2xl font-bold">→</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile/Tablet view - Responsive grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((stage) => (
              <div key={stage.name} className={`${stage.color} rounded-lg p-3 text-white text-center hover:shadow-xl transition-all cursor-pointer border-2 border-white/20`}>
                <div className="text-2xl mb-1">{stage.icon}</div>
                <div className="text-xl font-bold mb-0.5">{stage.count}</div>
                <div className="text-xs font-bold opacity-100">{stage.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-6 border-t-2 border-hti-yellow/20">
        <div className="text-center p-4 bg-hti-red/10 rounded-lg border-2 border-hti-red/30">
          <div className="text-xl md:text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs md:text-sm text-hti-yellow font-bold mt-1">Total in Pipeline</div>
        </div>
        <div className="text-center p-4 bg-green-600/10 rounded-lg border-2 border-green-600/30">
          <div className="text-xl md:text-2xl font-bold text-hti-yellow-bright">{stats.completionRate}%</div>
          <div className="text-xs md:text-sm text-hti-yellow font-bold mt-1">Completion Rate</div>
        </div>
        <div className="text-center p-4 bg-hti-orange/10 rounded-lg border-2 border-hti-orange/30">
          <div className="text-xl md:text-2xl font-bold text-hti-yellow">{stats.avgCycleTime}</div>
          <div className="text-xs md:text-sm text-hti-yellow font-bold mt-1">Avg Cycle Time</div>
        </div>
        <div className="text-center p-4 bg-hti-yellow/10 rounded-lg border-2 border-hti-yellow/30">
          <div className="text-xl md:text-2xl font-bold text-hti-red">{stats.bottleneck}</div>
          <div className="text-xs md:text-sm text-hti-yellow font-bold mt-1">Bottleneck</div>
        </div>
      </div>
    </div>
  );
}
