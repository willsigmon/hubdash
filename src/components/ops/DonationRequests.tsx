"use client";

import { formatDate } from "@/lib/utils/date-formatters";
import { getPriorityColor, getRequestStatusColor } from "@/lib/utils/status-colors";
import Link from "next/link";
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

export default function DonationRequests() {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn('DonationRequests: expected array but received', data);
          setRequests([]);
          setLoading(false);
          return;
        }
        // Filter to only show pending/scheduled/in-progress (not completed)
        const activeRequests = data.filter((r: DonationRequest) =>
          r && typeof r === 'object' && (
            r.status === 'pending' || r.status === 'scheduled' || r.status === 'in_progress'
          )
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
      <div className="bg-surface rounded-xl border border-default shadow overflow-hidden">
        <div className="divide-y divide-default/50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="bg-surface-alt h-16 rounded mb-3" />
              <div className="bg-surface-alt h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-default shadow overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 bg-surface-alt/60 border-b border-default">
        <h3 className="text-lg font-bold text-primary">📦 Donation Requests</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-default/50">
          {requests.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-muted">
              <div className="text-4xl md:text-5xl mb-3">📭</div>
              <p className="text-sm md:text-base font-medium text-secondary">No pending donation requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 md:p-6 hover:bg-surface-alt transition-colors border-l-4 border-l-transparent hover:border-l-accent"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(request.priority)}`} />
                    <Link href={`/ops/partners/${request.id}`} className="flex-1 min-w-0 group">
                      <h4 className="text-base md:text-lg font-bold text-primary truncate group-hover:text-accent transition-colors">
                        {request.company}
                      </h4>
                      <p className="text-xs md:text-sm text-secondary truncate">{request.contact_name}</p>
                    </Link>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-muted font-medium">{formatDate(request.requested_date)}</div>
                    <div className={`text-xs font-bold ${getRequestStatusColor(request.status)} capitalize mt-1`}>
                      {request.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-xs md:text-sm text-secondary mb-4 ml-6 md:ml-8 font-medium">
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span className="font-bold text-primary">{request.device_count}</span>
                    <span className="hidden md:inline">devices</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                    <span>📍</span>
                    <span className="truncate">{request.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-6 md:ml-8">
                  <button className="flex-1 px-3 md:px-4 py-2 accent-gradient hover:shadow-lg rounded-lg text-white text-xs md:text-sm font-bold transition-all hover:scale-105">
                    Schedule Pickup
                  </button>
                  <Link
                    href={`/ops/partners/${request.id}`}
                    className="px-3 md:px-4 py-2 bg-soft-highlight hover:bg-soft-highlight rounded-lg text-highlight text-xs md:text-sm font-bold transition-all border border-highlight text-center"
                  >
                    View Partner →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 bg-surface-alt/60 border-t border-default">
        <button className="w-full text-center text-xs md:text-sm font-bold text-secondary hover:text-primary transition-colors py-2">
          View All Requests →
        </button>
      </div>
    </div>
  );
}
