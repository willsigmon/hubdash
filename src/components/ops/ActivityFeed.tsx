"use client";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "success" | "warning" | "info";
  icon: string;
}

const activities: Activity[] = [
  {
    id: "1",
    user: "Alex M.",
    action: "completed QA testing for",
    target: "Batch #127 (15 devices)",
    timestamp: "2 min ago",
    type: "success",
    icon: "✅",
  },
  {
    id: "2",
    user: "Sarah J.",
    action: "scheduled pickup for",
    target: "Tech Solutions Inc (75 devices)",
    timestamp: "8 min ago",
    type: "info",
    icon: "📅",
  },
  {
    id: "3",
    user: "Mike W.",
    action: "flagged issue with",
    target: "Device #4521 (failed boot)",
    timestamp: "15 min ago",
    type: "warning",
    icon: "⚠️",
  },
  {
    id: "4",
    user: "System",
    action: "generated Certificate of Destruction for",
    target: "Batch #125",
    timestamp: "23 min ago",
    type: "success",
    icon: "📜",
  },
  {
    id: "5",
    user: "Jennifer D.",
    action: "distributed",
    target: "12 Chromebooks to Warren County Library",
    timestamp: "34 min ago",
    type: "success",
    icon: "🎯",
  },
  {
    id: "6",
    user: "Robert S.",
    action: "started data wipe on",
    target: "Batch #128 (22 devices)",
    timestamp: "41 min ago",
    type: "info",
    icon: "🔒",
  },
];

const typeColors = {
  success: "border-green-500/30 bg-green-500/5",
  warning: "border-orange-500/30 bg-orange-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
};

export default function ActivityFeed() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Live Updates</span>
        </div>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          Clear All
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-4 border-l-2 ${typeColors[activity.type]} hover:bg-gray-750 transition-colors`}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="text-hti-teal">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
