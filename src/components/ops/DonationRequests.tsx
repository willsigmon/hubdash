"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/date-formatters";
import { getPriorityColor, getRequestStatusColor } from "@/lib/utils/status-colors";

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
      <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
        <div className="divide-y divide-white/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="bg-white/10 h-16 rounded mb-3" />
              <div className="bg-white/10 h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden flex flex-col h-full">
      <div className="px-4 md:px-6 py-4 glass-divider">
        <h3 className="text-lg font-bold text-glass-bright">📦 Donation Requests</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-white/10">
          {requests.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-glass-muted">
              <div className="text-4xl md:text-5xl mb-3">📭</div>
              <p className="text-sm md:text-base font-medium">No pending donation requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 md:p-6 transition-colors border-l-4 border-l-transparent hover:border-l-hti-orange hover:bg-white/10"
              >
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(request.priority)}`} />
                    <Link href={`/ops/partners/${request.id}`} className="flex-1 min-w-0 group">
                      <h4 className="text-base md:text-lg font-bold text-glass-bright truncate group-hover:text-hti-yellow transition-colors">
                        {request.company}
                      </h4>
                      <p className="text-xs md:text-sm text-glass-muted truncate">{request.contact_name}</p>
                    </Link>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-glass-muted font-medium">{formatDate(request.requested_date)}</div>
                    <div className={`text-xs font-bold ${getRequestStatusColor(request.status)} capitalize mt-1`}>
                      {request.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-xs md:text-sm text-glass-muted mb-4 ml-6 md:ml-8 font-medium">
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span className="glass-chip glass-chip--teal text-xs md:text-sm">{request.device_count} units</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                    <span>📍</span>
                    <span className="truncate">{request.location}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-6 md:ml-8">
                  <button
                    className="glass-button glass-button--accent flex-1 text-xs md:text-sm"
                    aria-label={`Schedule pickup for ${request.company}`}
                  >
                    Schedule Pickup
                  </button>
                  <Link
                    href={`/ops/partners/${request.id}`}
                    className="glass-button text-xs md:text-sm"
                  >
                    View Partner →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-3 md:p-4 glass-divider">
        <button
          className="w-full text-center text-xs md:text-sm font-bold text-glass-bright hover:text-hti-yellow transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-hti-yellow rounded"
          aria-label="View all donation requests"
        >
          View All Requests <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
