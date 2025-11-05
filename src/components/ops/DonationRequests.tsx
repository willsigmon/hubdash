"use client";

interface DonationRequest {
  id: string;
  company: string;
  contact: string;
  deviceCount: number;
  location: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "scheduled" | "in_progress";
  requestedDate: string;
}

const requests: DonationRequest[] = [
  {
    id: "1",
    company: "Tech Solutions Inc",
    contact: "Sarah Johnson",
    deviceCount: 75,
    location: "Henderson, NC",
    priority: "urgent",
    status: "pending",
    requestedDate: "Today",
  },
  {
    id: "2",
    company: "County Public Schools",
    contact: "Mike Williams",
    deviceCount: 120,
    location: "Vance County",
    priority: "high",
    status: "scheduled",
    requestedDate: "Yesterday",
  },
  {
    id: "3",
    company: "Local Law Firm",
    contact: "Jennifer Davis",
    deviceCount: 18,
    location: "Raleigh, NC",
    priority: "normal",
    status: "pending",
    requestedDate: "2 days ago",
  },
  {
    id: "4",
    company: "Manufacturing Plant",
    contact: "Robert Smith",
    deviceCount: 45,
    location: "Warren County",
    priority: "high",
    status: "pending",
    requestedDate: "3 days ago",
  },
];

const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
};

const statusColors = {
  pending: "text-yellow-400",
  scheduled: "text-green-400",
  in_progress: "text-blue-400",
};

export default function DonationRequests() {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      <div className="divide-y divide-gray-700">
        {requests.map((request) => (
          <div
            key={request.id}
            className="p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${priorityColors[request.priority]}`} />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {request.company}
                  </h3>
                  <p className="text-sm text-gray-400">{request.contact}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{request.requestedDate}</div>
                <div className={`text-xs font-medium ${statusColors[request.status]} capitalize mt-1`}>
                  {request.status.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <span>💻</span>
                <span>{request.deviceCount} devices</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{request.location}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white text-sm font-medium transition-colors">
                Schedule Pickup
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <button className="w-full text-center text-sm font-medium text-hti-teal hover:text-hti-teal-light transition-colors">
          View All Requests ({requests.length + 8} total) →
        </button>
      </div>
    </div>
  );
}
