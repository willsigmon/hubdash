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
        setRequests(activeRequests.slice(0, 6)); // Show top 6
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN || ''}`,
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
            setRequests(activeRequests.slice(0, 6)); // Show more now that we have full width
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
    <div className="bg-surface rounded-2xl border border-default shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-surface-alt/90 to-surface-alt/70 border-b border-default">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 rounded-lg accent-gradient">
              <Package className="w-5 h-5 text-on-accent" />
            </div>
            Donation Requests
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary bg-surface px-3 py-1.5 rounded-lg border border-default">
              {requests.length} Active
            </span>
            <Link
              href="/ops/donations"
              className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>
        <p className="text-sm text-secondary">
          Manage incoming donation requests and schedule pickups
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {requests.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4 opacity-30">📦</div>
            <p className="text-lg font-semibold text-primary mb-2">No pending donation requests</p>
            <p className="text-sm text-secondary">All donations have been processed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group relative rounded-xl border-2 border-default bg-surface-alt p-5 hover:border-accent/50 hover:shadow-lg transition-all"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2 ${
                    request.status === 'scheduled'
                      ? 'bg-soft-success text-success border-success/50'
                      : request.status === 'in_progress'
                      ? 'bg-soft-warning text-warning border-warning/50'
                      : 'bg-soft-accent text-accent border-accent/50'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Company Name */}
                <div className="pr-20 mb-4">
                  <h4 className="text-xl font-bold text-primary group-hover:text-accent transition-colors mb-2">
                    {request.company}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <User className="w-4 h-4 text-muted" />
                    <span className="font-medium">{request.contact_name}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-surface p-3 border border-default">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-accent" />
                      <div className="text-xs font-semibold text-secondary uppercase tracking-wide">Devices</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{request.device_count}</div>
                  </div>
                  <div className="rounded-lg bg-surface p-3 border border-default">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-highlight" />
                      <div className="text-xs font-semibold text-secondary uppercase tracking-wide">Location</div>
                    </div>
                    <div className="text-sm font-semibold text-primary truncate">{request.location}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-secondary mb-4 pb-4 border-b border-default">
                  <Calendar className="w-3.5 h-3.5 text-muted" />
                  <span>Requested {formatDate(request.requested_date)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSchedulePickup(request.id)}
                    disabled={schedulePickupMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 accent-gradient text-on-accent rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-4 h-4" />
                    {schedulePickupMutation.isPending ? 'Scheduling...' : 'Schedule Pickup'}
                  </button>
                  <Link
                    href={`/ops/donations/${request.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border-2 border-default text-primary rounded-lg text-sm font-semibold hover:bg-surface-alt hover:border-strong transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
