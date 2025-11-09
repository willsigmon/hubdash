"use client";

import { formatDate } from "@/lib/utils/date-formatters";
import { getPriorityColor, getRequestStatusColor } from "@/lib/utils/status-colors";
import { Calendar, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  const schedulePickupMutation = useMutation({
    mutationFn: async ({ id, scheduledDate }: { id: string; scheduledDate: string }) => {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'scheduled',
          scheduledDate,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || error.message || 'Failed to schedule pickup');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      // Refetch donations
      fetch('/api/donations')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const activeRequests = data.filter((r: DonationRequest) =>
              r && typeof r === 'object' && (
                r.status === 'pending' || r.status === 'scheduled' || r.status === 'in_progress'
              )
            );
            setRequests(activeRequests.slice(0, 4));
          }
        });
    },
  });

  const handleSchedulePickup = (requestId: string) => {
    // Set scheduled date to tomorrow by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduledDate = tomorrow.toISOString().split('T')[0];
    
    if (confirm('Schedule pickup for tomorrow?')) {
      schedulePickupMutation.mutate({ id: requestId, scheduledDate });
    }
  };

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
    <div className="bg-surface rounded-2xl border border-default shadow-lg overflow-hidden flex flex-col h-full backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-surface-alt/80 to-surface-alt/60 border-b border-default">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            Donation Requests
          </h3>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted bg-surface px-2 py-1 rounded-full">
            {requests.length} Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4 opacity-50">📭</div>
              <p className="text-base font-medium text-secondary">No pending donation requests</p>
              <p className="text-sm text-muted mt-2">All donations have been processed</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="group relative rounded-xl border border-default bg-surface-alt/50 p-5 hover:border-accent/50 hover:shadow-md transition-all backdrop-blur-sm"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    request.status === 'scheduled' 
                      ? 'bg-soft-success text-success border-success/30'
                      : request.status === 'in_progress'
                      ? 'bg-soft-warning text-warning border-warning/30'
                      : 'bg-soft-accent text-accent border-accent/30'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Company Name */}
                <div className="pr-24 mb-4">
                  <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-1">
                    {request.company}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <User className="w-4 h-4" />
                    <span>{request.contact_name}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-soft-accent text-accent">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted uppercase tracking-wide">Devices</div>
                      <div className="font-bold text-primary">{request.device_count}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-soft-highlight text-highlight">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted uppercase tracking-wide">Location</div>
                      <div className="font-medium text-primary truncate">{request.location}</div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Requested {formatDate(request.requested_date)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-default">
                  <button
                    onClick={() => handleSchedulePickup(request.id)}
                    disabled={schedulePickupMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 accent-gradient text-on-accent rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-4 h-4" />
                    {schedulePickupMutation.isPending ? 'Scheduling...' : 'Schedule Pickup'}
                  </button>
                  <Link
                    href={`/ops/partners/${request.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-default text-primary rounded-lg text-sm font-semibold hover:bg-surface-hover hover:border-strong transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-surface-alt/60 border-t border-default">
        <Link
          href="/ops/donations"
          className="block w-full text-center text-sm font-semibold text-secondary hover:text-primary transition-colors py-2"
        >
          View All Requests →
        </Link>
      </div>
    </div>
  );
}
