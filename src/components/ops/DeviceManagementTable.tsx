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
import { BulkActions } from "../ui/BulkActions";
import { TableSkeleton } from "../ui/Skeleton";
import { ExportWizard, ExportFormat, DateRange } from "../ui/ExportWizard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash2 as Trash2Icon, Edit, Download as DownloadIcon } from "lucide-react";

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
// Actual Knack statuses from field_56
const DEVICE_STATUSES = ["Donated", "Received", "Data Wipe", "Refurbishing", "QA Testing", "Ready", "Completed-Presented"];

interface DeviceManagementTableProps {
  defaultStatusFilter?: string;
}

export function DeviceManagementTable({ defaultStatusFilter }: DeviceManagementTableProps = {}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(defaultStatusFilter || "all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Device>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Device>>({});
  const [journeyDevice, setJourneyDevice] = useState<Device | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExportWizard, setShowExportWizard] = useState(false);

  const { data, isLoading, error } = useQuery<{ data: Device[]; total?: number; page?: number }>({
    queryKey: queryKeys.devicesPaginated(page, limit, statusFilter !== "all" ? statusFilter : undefined),
    queryFn: async () => {
      let url = `/api/devices?page=${page}&limit=${limit}`;
      if (statusFilter !== "all") url += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch devices");
      const result = await res.json();
      // Handle both response formats
      return {
        data: result.data || result.devices || [],
        total: result.total || result.pagination?.total || (result.data?.length || 0),
        page: result.page || page,
      };
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

  const devices = data?.data || [];
  const filteredDevices = devices.filter((d: Device) => {
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
    const rows = filteredDevices.map((d: Device) => [
      d.serial_number || "",
      d.device_type || "",
      d.status || "",
      d.date_received || "",
      d.date_deployed || "",
      d.organization || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(","))
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
          <GradientHeading className="text-3xl mb-2" variant="navy">
            Device Management
          </GradientHeading>
          <p className="text-secondary text-sm">
            {data?.total || 0} total devices in system
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExportWizard(true)}
            className="px-4 py-2 bg-surface-alt border border-default rounded-lg hover:bg-surface transition-all hover:scale-105 flex items-center gap-2 text-primary font-semibold"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 accent-gradient text-on-accent rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 font-semibold"
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
        <GlassCard className="border border-accent">
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
                className="px-4 py-2 accent-gradient text-on-accent rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
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
          <TableSkeleton rows={10} />
        ) : error ? (
          <div className="text-center py-12 text-danger">
            Error loading devices. Please try again.
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12">
            <Laptop className="w-16 h-16 text-muted/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-primary mb-2">No devices match your filters</p>
            <p className="text-sm text-secondary mb-4">Try adjusting your search or filters, or view all devices</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="px-4 py-2 accent-gradient text-on-accent rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setPage(1)}
                className="px-4 py-2 bg-surface border border-default rounded-lg text-sm font-semibold text-primary hover:bg-surface-alt transition-colors"
              >
                View All Devices
              </button>
            </div>
            {devices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-default">
                <p className="text-xs text-secondary mb-3">Showing {devices.length} total devices in system</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                  {devices.slice(0, 4).map((device: Device) => (
                    <div key={device.id} className="p-3 bg-surface-alt rounded-lg border border-default">
                      <div className="text-xs font-semibold text-secondary mb-1">Serial</div>
                      <div className="text-sm font-mono text-primary">{device.serial_number || "N/A"}</div>
                      <div className="text-xs text-muted mt-1">{device.device_type || "Unknown"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-default">
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredDevices.length && filteredDevices.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filteredDevices.map((d: Device) => d.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      className="w-4 h-4 rounded border-default cursor-pointer"
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Serial #</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Date Received</th>
                  <th className="text-left p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Organization</th>
                  <th className="text-right p-4 text-xs font-semibold tracking-wide text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => (
                  <motion.tr
                    key={device.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "border-b border-default hover:bg-surface-alt transition-all",
                      selectedIds.has(device.id) && "bg-soft-accent"
                    )}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(device.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedIds);
                          if (e.target.checked) {
                            newSet.add(device.id);
                          } else {
                            newSet.delete(device.id);
                          }
                          setSelectedIds(newSet);
                        }}
                        className="w-4 h-4 rounded border-default cursor-pointer"
                      />
                    </td>
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
                              className="p-2 bg-soft-success text-success rounded-lg hover:bg-soft-success transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                              }}
                              className="p-2 bg-soft-danger text-danger rounded-lg hover:bg-soft-danger transition-colors"
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bulk Actions */}
        <BulkActions
          selectedIds={Array.from(selectedIds)}
          actions={[
            {
              id: "delete",
              label: "Delete",
              icon: <Trash2Icon className="w-4 h-4" />,
              variant: "danger",
              requiresConfirmation: true,
              confirmationMessage: `Are you sure you want to delete ${selectedIds.size} device(s)? This action cannot be undone.`,
              action: async (ids) => {
                await Promise.all(ids.map(id => deleteMutation.mutateAsync(id)));
                setSelectedIds(new Set());
              },
            },
            {
              id: "export",
              label: "Export Selected",
              icon: <DownloadIcon className="w-4 h-4" />,
              action: async (ids) => {
                setShowExportWizard(true);
              },
            },
          ]}
          onClearSelection={() => setSelectedIds(new Set())}
          totalCount={filteredDevices.length}
        />

        {/* Export Wizard */}
        <ExportWizard
          isOpen={showExportWizard}
          onClose={() => setShowExportWizard(false)}
          onExport={async (format: ExportFormat, dateRange: DateRange, customDates) => {
            const devicesToExport = filteredDevices.filter((d: Device) =>
              selectedIds.size === 0 || selectedIds.has(d.id)
            );

            if (format === "csv") {
              const headers = ["Serial Number", "Type", "Status", "Date Received", "Date Deployed", "Organization"];
              const rows = devicesToExport.map((d: Device) => [
                d.serial_number || "",
                d.device_type || "",
                d.status || "",
                d.date_received || "",
                d.date_deployed || "",
                d.organization || "",
              ]);
              const csv = [
                headers.join(","),
                ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(","))
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `devices-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            } else {
              // Handle other formats
              console.log("Exporting", format, dateRange, devicesToExport.length);
            }
          }}
          title="Export Devices"
        />

        {/* Pagination */}
        {data && data.total && data.total > limit && (
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
                disabled={data.total ? page >= Math.ceil(data.total / limit) : true}
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
