"use client";

interface PipelineStage {
  name: string;
  count: number;
  color: string;
  icon: string;
}

const stages: PipelineStage[] = [
  { name: "Donated", count: 28, color: "bg-gray-600", icon: "📥" },
  { name: "Received", count: 23, color: "bg-blue-600", icon: "✓" },
  { name: "Data Wipe", count: 19, color: "bg-purple-600", icon: "🔒" },
  { name: "Refurbishing", count: 34, color: "bg-orange-600", icon: "🔧" },
  { name: "QA Testing", count: 12, color: "bg-yellow-600", icon: "🧪" },
  { name: "Ready", count: 43, color: "bg-green-600", icon: "✅" },
  { name: "Distributed", count: 8, color: "bg-hti-teal", icon: "🎯" },
];

export default function DevicePipeline() {
  const totalDevices = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
      {/* Pipeline Flow */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            {/* Stage Card */}
            <div className={`${stage.color} rounded-lg p-4 text-white hover:scale-105 transition-transform cursor-pointer`}>
              <div className="text-center">
                <div className="text-2xl mb-2">{stage.icon}</div>
                <div className="text-2xl font-bold mb-1">{stage.count}</div>
                <div className="text-xs font-medium opacity-90">{stage.name}</div>
              </div>
            </div>

            {/* Arrow */}
            {index < stages.length - 1 && (
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                <div className="text-gray-600 text-2xl">→</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalDevices}</div>
          <div className="text-xs text-gray-400">Total in Pipeline</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">87%</div>
          <div className="text-xs text-gray-400">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">4.2d</div>
          <div className="text-xs text-gray-400">Avg Cycle Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">34</div>
          <div className="text-xs text-gray-400">Bottleneck (Refurb)</div>
        </div>
      </div>
    </div>
  );
}
