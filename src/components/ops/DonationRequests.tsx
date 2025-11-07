"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { formatDate, formatPlural } from "@/lib/utils/date-formatters";
import { getPriorityColor, getRequestStatusColor, PRIORITY_COLORS } from "@/lib/utils/status-colors";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/components/ui/EmptyState";
import {
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface DonationRequest {
  id: string;
  company: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  device_count: number;
  location: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "scheduled" | "in_progress" | "completed";
  requested_date: string;
  notes?: string;
}

type StatusFilter = "all" | "pending" | "scheduled" | "in_progress" | "completed";
type PriorityFilter = "all" | "urgent" | "high" | "normal";
type SortOption = "date_desc" | "date_asc" | "priority" | "devices_desc" | "devices_asc";

async function fetchDonations(): Promise<DonationRequest[]> {
  const res = await fetch('/api/donations');
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    const message = typeof data === 'object' && data && 'error' in data ? (data as any).error : 'Failed to fetch donations';
    throw new Error(message);
  }
  return Array.isArray(data) ? data : [];
}

async function updateDonationStatus(id: string, status: string, priority?: string) {
  const res = await fetch(`/api/donations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, priority }),
  });
  if (!res.ok) throw new Error('Failed to update donation');
  return res.json();
}

export default function DonationRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);

  const queryClient = useQueryClient();

  // Fetch donations with React Query
  const { data: allRequests = [], isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: fetchDonations,
    refetchInterval: false,
    retry: false,
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status, priority }: { id: string; status: string; priority?: string }) =>
      updateDonationStatus(id, status, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      setSelectedRequest(null);
    },
  });

  // Filter and sort requests
  const filteredAndSorted = useMemo(() => {
    let filtered = allRequests.filter((req) => {
      // Status filter
      if (statusFilter !== "all" && req.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && req.priority !== priorityFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          req.company.toLowerCase().includes(query) ||
          req.contact_name.toLowerCase().includes(query) ||
          req.location.toLowerCase().includes(query) ||
          req.contact_email?.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.requested_date).getTime() - new Date(a.requested_date).getTime();
        case "date_asc":
          return new Date(a.requested_date).getTime() - new Date(b.requested_date).getTime();
        case "priority":
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "devices_desc":
          return b.device_count - a.device_count;
        case "devices_asc":
          return a.device_count - b.device_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allRequests, statusFilter, priorityFilter, searchQuery, sortBy]);

  // Show only active requests (not completed) by default, limit to 6
  const displayRequests = filteredAndSorted
    .filter(req => statusFilter === "all" ? req.status !== "completed" : true)
    .slice(0, 6);

  const handleStatusUpdate = (request: DonationRequest, newStatus: string) => {
    updateMutation.mutate({
      id: request.id,
      status: newStatus,
      priority: request.priority,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "scheduled":
        return <Calendar className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case "pending":
        return "scheduled";
      case "scheduled":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return null;
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-5 h-5" />}
        title="Donation feed is taking a break"
        description={error instanceof Error ? error.message : 'We’ll try again shortly. Your last synced data remains safe.'}
        actionLabel="Retry now"
        onAction={() => queryClient.invalidateQueries({ queryKey: ['donations'] })}
        tone="warning"
      />
    );
  }

  const statusCounts = {
    all: allRequests.length,
    pending: allRequests.filter(r => r.status === "pending").length,
    scheduled: allRequests.filter(r => r.status === "scheduled").length,
    in_progress: allRequests.filter(r => r.status === "in_progress").length,
    completed: allRequests.filter(r => r.status === "completed").length,
  };

  return (
    <>
      <div className="glass-card glass-card--subtle shadow-glass overflow-hidden flex flex-col h-full">
        {/* Header with Search and Filters */}
        <div className="px-4 md:px-6 py-4 glass-divider space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-glass-bright flex items-center gap-2">
              📦 Donation Requests
              <span className="glass-chip glass-chip--slate text-xs">
                {filteredAndSorted.length}
              </span>
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button text-xs p-2"
              aria-label="Toggle filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-glass-muted" />
            <input
              type="text"
              placeholder="Search by company, contact, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-glass-muted hover:text-glass-bright"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Status Filter */}
              <div>
                <label className="text-xs text-glass-muted mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="glass-input w-full text-sm py-1.5"
                >
                  <option value="all">All ({statusCounts.all})</option>
                  <option value="pending">Pending ({statusCounts.pending})</option>
                  <option value="scheduled">Scheduled ({statusCounts.scheduled})</option>
                  <option value="in_progress">In Progress ({statusCounts.in_progress})</option>
                  <option value="completed">Completed ({statusCounts.completed})</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs text-glass-muted mb-1 block">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                  className="glass-input w-full text-sm py-1.5"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-span-2">
                <label className="text-xs text-glass-muted mb-1 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="glass-input w-full text-sm py-1.5"
                >
                  <option value="priority">Priority (High to Low)</option>
                  <option value="date_desc">Date (Newest First)</option>
                  <option value="date_asc">Date (Oldest First)</option>
                  <option value="devices_desc">Device Count (High to Low)</option>
                  <option value="devices_asc">Device Count (Low to High)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-white/10">
            {displayRequests.length === 0 ? (
              <div className="p-8 md:p-12 text-center text-glass-muted">
                <div className="text-4xl md:text-5xl mb-3">📭</div>
                <p className="text-sm md:text-base font-medium">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No requests match your filters"
                    : "No pending donation requests"}
                </p>
                {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                    }}
                    className="mt-4 glass-button text-xs"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              displayRequests.map((request) => {
                const nextStatus = getNextStatus(request.status);
                return (
                  <div
                    key={request.id}
                    className="p-4 md:p-6 transition-all border-l-4 border-l-transparent hover:border-l-hti-teal hover:bg-white/5 group"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${getPriorityColor(request.priority)}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base md:text-lg font-bold text-glass-bright truncate group-hover:text-hti-teal transition-colors">
                            {request.company || request.contact_name || 'Donation Request'}
                          </h4>
                          {request.company && request.contact_name && (
                            <p className="text-xs md:text-sm text-glass-muted truncate flex items-center gap-1 mt-0.5">
                              {request.contact_name}
                              {request.contact_email && (
                                <a
                                  href={`mailto:${request.contact_email}`}
                                  className="text-hti-teal hover:text-hti-teal-light ml-2"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Email ${request.contact_name}`}
                                >
                                  <Mail className="w-3 h-3" />
                                </a>
                              )}
                            </p>
                          )}
                          {!request.company && request.contact_email && (
                            <a
                              href={`mailto:${request.contact_email}`}
                              className="text-xs md:text-sm text-hti-teal hover:text-hti-teal-light truncate flex items-center gap-1 mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="w-3 h-3" />
                              {request.contact_email}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-glass-muted font-medium flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.requested_date)}
                        </div>
                        <div className={`text-xs font-bold ${getRequestStatusColor(request.status)} capitalize mt-1 flex items-center gap-1 justify-end`}>
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-glass-muted mb-4 ml-6 md:ml-8">
                      <div className="flex items-center gap-2">
                        <span>💻</span>
                        <span className="glass-chip glass-chip--teal text-xs">
                          {formatPlural(request.device_count, 'Device')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {request.location || <span className="text-glass-muted italic">Not specified</span>}
                        </span>
                      </div>
                      {request.contact_phone && (
                        <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <a href={`tel:${request.contact_phone}`} className="truncate hover:text-hti-teal">
                            {request.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-6 md:ml-8 flex-wrap">
                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(request, nextStatus)}
                          disabled={updateMutation.isPending}
                          className="glass-button glass-button--accent flex-1 text-xs md:text-sm min-w-[140px]"
                          aria-label={`Update status to ${nextStatus}`}
                        >
                          {updateMutation.isPending ? (
                            "Updating..."
                          ) : (
                            <>
                              {nextStatus === "scheduled" && "Schedule Pickup"}
                              {nextStatus === "in_progress" && "Mark In Progress"}
                              {nextStatus === "completed" && "Mark Complete"}
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="glass-button text-xs md:text-sm"
                        aria-label="View details"
                      >
                        Details
                      </button>
                      <Link
                        href={`/ops/partners/${request.id}`}
                        className="glass-button text-xs md:text-sm flex items-center gap-1"
                        aria-label="View partner page"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 glass-divider flex items-center justify-between">
          <div className="text-xs text-glass-muted">
            Showing {displayRequests.length} of {filteredAndSorted.length}
          </div>
          {filteredAndSorted.length > displayRequests.length && (
            <Link
              href="/ops/donations"
              className="text-xs md:text-sm font-bold text-glass-bright hover:text-hti-teal transition-colors flex items-center gap-1"
              aria-label="View all donation requests"
            >
              View All <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="glass-card glass-card--subtle shadow-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-glass-bright">
                  {selectedRequest.company || selectedRequest.contact_name || 'Donation Request'}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-glass-muted hover:text-glass-bright"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedRequest.company && (
                <div className="text-sm text-glass-muted">
                  <span className="font-semibold">Company:</span> {selectedRequest.company}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-glass-muted mb-1">Contact</p>
                  <p className="text-sm font-semibold text-glass-bright">
                    {selectedRequest.contact_name || <span className="text-glass-muted italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-glass-muted mb-1">Status</p>
                  <p className={`text-sm font-bold ${getRequestStatusColor(selectedRequest.status)} capitalize`}>
                    {selectedRequest.status.replace('_', ' ')}
                  </p>
                </div>
                {selectedRequest.contact_email ? (
                  <div>
                    <p className="text-xs text-glass-muted mb-1">Email</p>
                    <a href={`mailto:${selectedRequest.contact_email}`} className="text-sm text-hti-teal hover:underline break-all">
                      {selectedRequest.contact_email}
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-glass-muted mb-1">Email</p>
                    <p className="text-sm text-glass-muted italic">Not provided</p>
                  </div>
                )}
                {selectedRequest.contact_phone ? (
                  <div>
                    <p className="text-xs text-glass-muted mb-1">Phone</p>
                    <a href={`tel:${selectedRequest.contact_phone}`} className="text-sm text-hti-teal hover:underline">
                      {selectedRequest.contact_phone}
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-glass-muted mb-1">Phone</p>
                    <p className="text-sm text-glass-muted italic">Not provided</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-glass-muted mb-1">Location</p>
                  <p className="text-sm text-glass-bright">
                    {selectedRequest.location || <span className="text-glass-muted italic">Not specified</span>}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-glass-muted mb-1">Devices</p>
                  <p className="text-sm font-bold text-glass-bright">
                    {formatPlural(selectedRequest.device_count, 'Device')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-glass-muted mb-1">Requested</p>
                  <p className="text-sm text-glass-bright">{formatDate(selectedRequest.requested_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-glass-muted mb-1">Priority</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${getPriorityColor(selectedRequest.priority)}`} />
                    <span className="text-sm text-glass-bright capitalize">{selectedRequest.priority}</span>
                  </div>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-xs text-glass-muted mb-1">Notes</p>
                  <p className="text-sm text-glass-bright">{selectedRequest.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t glass-divider">
                {getNextStatus(selectedRequest.status) && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest, getNextStatus(selectedRequest.status)!);
                    }}
                    disabled={updateMutation.isPending}
                    className="glass-button glass-button--accent flex-1"
                  >
                    {updateMutation.isPending ? "Updating..." : `Mark as ${getNextStatus(selectedRequest.status)?.replace('_', ' ')}`}
                  </button>
                )}
                <Link
                  href={`/ops/partners/${selectedRequest.id}`}
                  className="glass-button flex-1 text-center"
                >
                  View Partner Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
