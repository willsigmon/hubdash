"use client";

interface Activity {
  id: string;
  type: "donation" | "distribution" | "training" | "partner";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "distribution",
    title: "50 Chromebooks Distributed",
    description: "Henderson County Schools received devices for students in need",
    timestamp: "2 hours ago",
    icon: "🎯",
    color: "bg-hti-teal",
  },
  {
    id: "2",
    type: "donation",
    title: "Corporate Donation Received",
    description: "Local business donated 75 laptops for refurbishment",
    timestamp: "5 hours ago",
    icon: "💻",
    color: "bg-hti-navy",
  },
  {
    id: "3",
    type: "training",
    title: "Digital Literacy Session Completed",
    description: "22 adults completed basic computer skills training",
    timestamp: "1 day ago",
    icon: "👥",
    color: "bg-hti-red",
  },
  {
    id: "4",
    type: "partner",
    title: "New Partnership Established",
    description: "Vance County Library joined as distribution partner",
    timestamp: "2 days ago",
    icon: "🤝",
    color: "bg-purple-600",
  },
  {
    id: "5",
    type: "distribution",
    title: "Veteran Program Delivery",
    description: "15 Chromebooks delivered to local veterans organization",
    timestamp: "3 days ago",
    icon: "🎖️",
    color: "bg-hti-teal",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-100">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`${activity.color} text-white p-3 rounded-lg text-2xl flex-shrink-0`}>
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-hti-teal hover:text-hti-navy transition-colors">
          View All Activity →
        </button>
      </div>
    </div>
  );
}
