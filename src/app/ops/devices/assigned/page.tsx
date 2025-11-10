"use client";

import GlassCard from "@/components/ui/GlassCard";
import GradientHeading from "@/components/ui/GradientHeading";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  UserCircle,
  Wrench
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AssignedDevice {
  id: string;
  serial: string;
  type: string;
  assignedTo: string;
  assignedDate: string;
  pickupDate?: string;
  driveWiped: boolean;
  osLoaded: boolean;
  tested: boolean;
  condition: string;
  specs?: string;
}

export default function AssignedDevicesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [techFilter, setTechFilter] = useState<string>("all");

  const limit = 25;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.devicesPaginated(page, limit, "Refurbishing"),
    queryFn: async () => {
      // Fetch devices with Refurbishing or Data Wipe status (assigned devices)
      const res1 = await fetch(`/api/devices?page=${page}&limit=${limit}&status=Refurbishing`);
      const res2 = await fetch(`/api/devices?page=${page}&limit=${limit}&status=Data Wipe`);
      if (!res1.ok || !res2.ok) throw new Error("Failed to fetch devices");
      const data1 = await res1.json();
      const data2 = await res2.json();
      return {
        data: [...(data1.data || []), ...(data2.data || [])],
        total: (data1.data?.length || 0) + (data2.data?.length || 0),
      };
    },
  });

  const updateCheckboxMutation = useMutation({
    mutationFn: async ({
      deviceId,
      field,
      value,
    }: {
      deviceId: string;
      field: "driveWiped" | "osLoaded" | "tested";
      value: boolean;
    }) => {
      // In production: PATCH /api/devices/:id
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update device");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const markConvertedMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      // In production: POST /api/devices/:id/convert
      const res = await fetch(`/api/devices/${deviceId}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to mark as converted");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const reassignMutation = useMutation({
    mutationFn: async ({
      deviceId,
      newTechId,
    }: {
      deviceId: string;
      newTechId: string;
    }) => {
      // In production: POST /api/devices/:id/reassign
      const res = await fetch(`/api/devices/${deviceId}/reassign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify({ technicianId: newTechId }),
      });
      if (!res.ok) throw new Error("Failed to reassign device");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const devices = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  // Mock technicians for filter (would come from API)
  const technicians = [
    "Sarah Chen",
    "Marcus Johnson",
    "Elena Rodriguez",
    "David Kim",
    "Amara Williams",
  ];

  const filteredDevices = devices.filter((d: any) => {
    const matchesSearch =
      (d.serial_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.device_type || d.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.assigned_to || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech = techFilter === "all" || (d.assigned_to || "") === techFilter;

    return matchesSearch && matchesTech;
  });

  const handleCheckbox = (deviceId: string, field: "driveWiped" | "osLoaded" | "tested", currentValue: boolean) => {
    updateCheckboxMutation.mutate({ deviceId, field, value: !currentValue });
  };

  const handleMarkConverted = (deviceId: string) => {
    if (confirm("Mark this device as converted/ready for presentation?")) {
      markConvertedMutation.mutate(deviceId);
    }
  };

  const getProgressPercentage = (device: any) => {
    // For now, use status to determine progress
    if (device.status === 'QA Testing') return 100;
    if (device.status === 'Refurbishing') return 66;
    if (device.status === 'Data Wipe') return 33;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-gray to-hti-navy/90 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/ops" className="inline-flex items-center gap-2 text-accent hover:text-accent-alt mb-4 transition-colors focus-ring">
          <ArrowLeft className="w-4 h-4" />
          Back to Operations
        </Link>

        <GradientHeading
          className="text-3xl mb-2"
          variant="navy"
        >
          Assigned Devices
        </GradientHeading>
        <p className="text-secondary mt-2">
          {data?.total || 0} devices currently with technicians
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters Bar */}
        <GlassCard>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search by serial, type, or technician..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder-muted"
                />
              </div>
            </div>

            {/* Technician Filter */}
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="px-4 py-3 bg-surface border border-default rounded-lg focus:outline-none focus-ring text-primary"
            >
              <option value="all">All Technicians</option>
              {technicians.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Legend */}
        <GlassCard variant="ghost">
          <div className="space-y-2">
            <div className="font-semibold text-primary">Progress Checklist:</div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" />
              <span className="text-secondary">Drive Wiped</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" />
              <span className="text-secondary">OS Loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-secondary">Tested</span>
            </div>
          </div>
        </GlassCard>

        {/* Devices Table */}
        <GlassCard>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-white/20 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-muted/30 mx-auto mb-4" />
              <p className="text-muted text-lg">No assigned devices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-alt border-b border-default">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Serial</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Technician</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Pickup Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Progress</th>
                    <th className="text-center p-3 text-sm font-semibold text-primary">Drive Wiped</th>
                    <th className="text-center p-3 text-sm font-semibold text-primary">OS Loaded</th>
                    <th className="text-center p-3 text-sm font-semibold text-primary">Tested</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((device: AssignedDevice) => {
                    const progress = getProgressPercentage(device);
                    const isComplete = progress === 100;

                    return (
                      <tr
                        key={device.id}
                        className="border-b border-default hover:bg-surface-alt transition-colors"
                      >
                        <td className="p-3 font-mono text-sm text-primary">{(device as any).serial_number || "—"}</td>
                        <td className="p-3 text-sm text-secondary">{(device as any).device_type || (device as any).model || "—"}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-accent" />
                            <span className="text-sm text-secondary">{(device as any).assigned_to || device.assignedTo || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 text-sm text-secondary">
                            <Calendar className="w-4 h-4 text-muted" />
                              {(device as any).received_date || device.assignedDate ? new Date((device as any).received_date || device.assignedDate).toLocaleDateString() : "—"}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-secondary">{progress.toFixed(0)}%</span>
                              {isComplete && (
                                <span className="text-emerald-600 font-semibold">Complete!</span>
                              )}
                            </div>
                            <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${isComplete
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                    : "accent-gradient"
                                  }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={device.status === 'Data Wipe' || device.status === 'Refurbishing' || device.status === 'QA Testing'}
                            disabled
                            className="w-5 h-5 rounded border-default text-accent focus-ring cursor-not-allowed opacity-50"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={device.status === 'Refurbishing' || device.status === 'QA Testing'}
                            disabled
                            className="w-5 h-5 rounded border-default text-accent focus-ring cursor-not-allowed opacity-50"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={device.status === 'QA Testing'}
                            disabled
                            className="w-5 h-5 rounded border-default text-accent focus-ring cursor-not-allowed opacity-50"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {isComplete && (
                              <button
                                onClick={() => handleMarkConverted(device.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded text-xs font-semibold hover:shadow-lg transition-all"
                              >
                                <Check className="w-3 h-3" />
                                Mark Ready
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const newTech = prompt("Enter new technician ID:");
                                if (newTech) reassignMutation.mutate({ deviceId: device.id, newTechId: newTech });
                              }}
                              className="p-1.5 hover:bg-surface-alt rounded transition-colors"
                              title="Reassign"
                            >
                              <RotateCcw className="w-4 h-4 text-secondary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-default">
              <div className="text-sm text-secondary">
                Page {page} of {totalPages} ({data?.total} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded bg-white/50 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded bg-white/50 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {filteredDevices.filter((d: AssignedDevice) => getProgressPercentage(d) === 100).length}
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">Ready to Convert</div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                {filteredDevices.filter((d: AssignedDevice) => getProgressPercentage(d) > 0 && getProgressPercentage(d) < 100).length}
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">In Progress</div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {filteredDevices.filter((d: AssignedDevice) => getProgressPercentage(d) === 0).length}
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">Not Started</div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-hti-gold mb-1">
                {filteredDevices.length > 0
                  ? (filteredDevices.reduce((sum: number, d: AssignedDevice) => sum + getProgressPercentage(d), 0) / filteredDevices.length).toFixed(0)
                  : 0}%
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">Avg Progress</div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
