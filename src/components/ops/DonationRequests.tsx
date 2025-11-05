"use client";

import { useEffect, useState } from "react";

interface DonationRequest {
  id: string;
  company: string;
  contact_name: string;
  device_count: number;
  location: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "scheduled" | "in_progress" | "completed";
  requested_date: string;
}

const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
};

const statusColors = {
  pending: "text-yellow-400",
  scheduled: "text-green-400",
  in_progress: "text-blue-400",
  completed: "text-gray-400",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString();
}

export default function DonationRequests() {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        // Filter to only show pending/scheduled (not completed)
        const activeRequests = data.filter((r: DonationRequest) =>
          r.status === 'pending' || r.status === 'scheduled' || r.status === 'in_progress'
        );
        setRequests(activeRequests.slice(0, 4)); // Show top 4
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching donations:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-700">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="bg-gray-700 h-16 rounded mb-3" />
              <div className="bg-gray-700 h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      <div className="divide-y divide-gray-700">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No pending donation requests</p>
          </div>
        ) : (
          requests.map((request) => (
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
                    <p className="text-sm text-gray-400">{request.contact_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{formatDate(request.requested_date)}</div>
                  <div className={`text-xs font-medium ${statusColors[request.status]} capitalize mt-1`}>
                    {request.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <span>💻</span>
                  <span>{request.device_count} devices</span>
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
          ))
        )}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <button className="w-full text-center text-sm font-medium text-hti-teal hover:text-hti-teal-light transition-colors">
          View All Requests →
        </button>
      </div>
    </div>
  );
}
