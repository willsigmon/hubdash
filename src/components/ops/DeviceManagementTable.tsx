"use client";

import { queryKeys } from "@/lib/query-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Edit2,
    Filter,
    Laptop,
    Plus,
    Search,
    Trash2,
    X
} from "lucide-react";
import { useState } from "react";
import { DeviceJourneyTimeline } from "../shared/DeviceJourneyTimeline";
import GlassCard from "../ui/GlassCard";
import GradientHeading from "../ui/GradientHeading";

interface Device {
  id: string;
  serial_number?: string;
  device_type?: string;
  status?: string;
  date_received?: string;
  date_deployed?: string;
  organization?: string;
}

const DEVICE_TYPES = ["Laptop", "Desktop", "Tablet", "Chromebook", "Monitor", "Other"];
const DEVICE_STATUSES = ["Received", "Testing", "Cleaning", "Ready", "Deployed", "Retired"];

export function DeviceManagementTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Device>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Device>>({});
  const [journeyDevice, setJourneyDevice] = useState<Device | null>(null);

  const { data, isLoading, error } = useQuery<{ devices: Device[]; total: number; page: number }>({
    queryKey: queryKeys.devicesPaginated(page, limit, statusFilter !== "all" ? statusFilter : undefined),
    queryFn: async () => {
      let url = `/api/devices?page=${page}&limit=${limit}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch devices");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/devices`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN || ""}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete device");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Device> }) => {
      const res = await fetch(`/api/devices`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN || ""}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update device");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setEditingId(null);
      setEditForm({});
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newDevice: Partial<Device>) => {
      const res = await fetch(`/api/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN || ""}`,
        },
        body: JSON.stringify(newDevice),
      });
      if (!res.ok) throw new Error("Failed to create device");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setShowCreateForm(false);
      setCreateForm({});
    },
  });

  const devices = data?.devices || [];
  const filteredDevices = devices.filter(d => {
    const matchesSearch = !searchQuery ||
      d.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.device_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || d.device_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleSaveEdit = (id: string) => {
    updateMutation.mutate({ id, updates: editForm });
  };

  const handleCreate = () => {
    createMutation.mutate(createForm);
  };

  const exportToCSV = () => {
    const headers = ["Serial Number", "Type", "Status", "Date Received", "Date Deployed", "Organization"];
    const rows = filteredDevices.map(d => [
      d.serial_number || "",
      d.device_type || "",
      d.status || "",
      d.date_received || "",
      d.date_deployed || "",
      d.organization || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devices-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Map device status values to semantic token-based badge classes
  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "Deployed":
        return "bg-soft-success text-success";
      case "Ready":
        return "bg-soft-accent text-accent";
      case "Received":
        return "bg-soft-warning text-warning";
      case "Testing":
      case "Cleaning":
        return "bg-soft-warning text-warning";
      case "Retired":
        return "bg-soft-danger text-danger";
      default:
        return "bg-soft-accent text-accent";
    }
  };

  return (
    <div className="space-y-6">
      {/* Device Journey Modal */}
      {journeyDevice && (
        <DeviceJourneyTimeline
          deviceId={journeyDevice.id}
          serialNumber={journeyDevice.serial_number || "Unknown"}
          deviceType={journeyDevice.device_type || "Unknown"}
          onClose={() => setJourneyDevice(null)}
        />
      )}

      {/* Header with Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <GradientHeading className="text-3xl mb-2" variant="plum">
            Device Management
          </GradientHeading>
          <p className="text-secondary text-sm">
            {data?.total || 0} total devices in system
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-surface-alt border border-default rounded-lg hover:bg-surface transition-colors flex items-center gap-2 text-primary"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 accent-gradient text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
          >
            <option value="all">All Statuses</option>
            {DEVICE_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
          >
            <option value="all">All Types</option>
            {DEVICE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="text-sm text-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {filteredDevices.length} devices shown
          </div>
        </div>
      </GlassCard>

      {/* Create Form Modal */}
      {showCreateForm && (
        <GlassCard className="border-2 border-accent/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Add New Device</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateForm({});
                }}
                className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Serial Number"
                value={createForm.serial_number || ""}
                onChange={(e) => setCreateForm({ ...createForm, serial_number: e.target.value })}
                className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
              />

              <select
                value={createForm.device_type || ""}
                onChange={(e) => setCreateForm({ ...createForm, device_type: e.target.value })}
                className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
              >
                <option value="">Select Type</option>
                {DEVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={createForm.status || ""}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
              >
                <option value="">Select Status</option>
                {DEVICE_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <input
                type="date"
                value={createForm.date_received || ""}
                onChange={(e) => setCreateForm({ ...createForm, date_received: e.target.value })}
                className="px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateForm({});
                }}
                className="px-4 py-2 border border-default rounded-lg hover:bg-surface-alt transition-colors text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-4 py-2 accent-gradient text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {createMutation.isPending ? "Creating..." : "Create Device"}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Devices Table */}
      <GlassCard>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface-alt rounded-lg p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-danger">
            Error loading devices. Please try again.
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12 text-muted">
            No devices found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-default">
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Serial #</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Date Received</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Organization</th>
                  <th className="text-right p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map(device => (
                  <tr
                    key={device.id}
                    className="border-b border-default hover:bg-surface-alt transition-colors"
                  >
                    {editingId === device.id ? (
                      <>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editForm.serial_number || device.serial_number || ""}
                            onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
                            className="px-2 py-1 bg-surface-alt border border-default rounded text-sm w-full focus:outline-none focus-ring text-primary placeholder:text-muted"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            value={editForm.device_type || device.device_type || ""}
                            onChange={(e) => setEditForm({ ...editForm, device_type: e.target.value })}
                            className="px-2 py-1 bg-surface-alt border border-default rounded text-sm w-full focus:outline-none focus-ring text-primary"
                          >
                            {DEVICE_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={editForm.status || device.status || ""}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="px-2 py-1 bg-surface-alt border border-default rounded text-sm w-full focus:outline-none focus-ring text-primary"
                          >
                            {DEVICE_STATUSES.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <input
                            type="date"
                            value={editForm.date_received || device.date_received || ""}
                            onChange={(e) => setEditForm({ ...editForm, date_received: e.target.value })}
                            className="px-2 py-1 bg-surface-alt border border-default rounded text-sm w-full focus:outline-none focus-ring text-primary"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editForm.organization || device.organization || ""}
                            onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                            className="px-2 py-1 bg-surface-alt border border-default rounded text-sm w-full focus:outline-none focus-ring text-primary placeholder:text-muted"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => handleSaveEdit(device.id)}
                              className="p-2 bg-soft-success text-success rounded-lg hover:bg-soft-success/80 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                              }}
                              className="p-2 bg-soft-danger text-danger rounded-lg hover:bg-soft-danger/80 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 text-sm font-mono">{device.serial_number || "—"}</td>
                        <td className="p-4 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-soft-accent text-accent">
                            <Laptop className="w-3 h-3" />
                            {device.device_type || "Unknown"}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(device.status)}`}>
                            {device.status || "Unknown"}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-secondary">{device.date_received || "—"}</td>
                        <td className="p-4 text-sm text-secondary">{device.organization || "—"}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => setJourneyDevice(device)}
                              className="p-2 hover:bg-soft-accent rounded-lg transition-colors text-accent"
                              title="View Device Journey"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(device.id);
                                setEditForm(device);
                              }}
                              className="p-2 hover:bg-soft-accent rounded-lg transition-colors text-accent"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this device?")) {
                                  deleteMutation.mutate(device.id);
                                }
                              }}
                              className="p-2 hover:bg-soft-danger rounded-lg transition-colors text-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > limit && (
          <div className="flex items-center justify-between pt-4 border-t border-default mt-4">
            <div className="text-sm text-secondary">
              Page {page} of {Math.ceil(data.total / limit)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-default rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / limit)}
                className="p-2 border border-default rounded-lg hover:bg-surface-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
