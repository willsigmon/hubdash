"use client";

import GlassCard from "@/components/ui/GlassCard";
import GradientHeading from "@/components/ui/GradientHeading";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Package,
    Search,
    UserPlus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Device {
  id: string;
  serial: string;
  type: string;
  dateReceived: string;
  donor?: string;
  condition: string;
  specs?: string;
}

interface Technician {
  id: string;
  name: string;
  activeDevices: number;
  completionRate: number;
}

const MOCK_TECHNICIANS: Technician[] = [
  { id: "1", name: "Sarah Chen", activeDevices: 12, completionRate: 94 },
  { id: "2", name: "Marcus Johnson", activeDevices: 8, completionRate: 89 },
  { id: "3", name: "Elena Rodriguez", activeDevices: 15, completionRate: 92 },
  { id: "4", name: "David Kim", activeDevices: 6, completionRate: 96 },
  { id: "5", name: "Amara Williams", activeDevices: 10, completionRate: 91 },
];

export default function UnassignedDevicesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const limit = 25;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.devicesPaginated(page, limit, "Ready"),
    queryFn: async () => {
      const res = await fetch(`/api/devices?page=${page}&limit=${limit}&status=Ready`);
      if (!res.ok) throw new Error("Failed to fetch devices");
      return res.json();
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      deviceIds,
      technicianId,
      pickupDate,
    }: {
      deviceIds: string[];
      technicianId: string;
      pickupDate: string;
    }) => {
      // In production: POST /api/devices/assign
      const res = await fetch("/api/devices/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify({ deviceIds, technicianId, pickupDate }),
      });
      if (!res.ok) throw new Error("Failed to assign devices");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setSelectedDevices(new Set());
      setShowAssignModal(false);
      setSelectedTechId("");
      setPickupDate("");
    },
  });

  const handleAssignDevices = () => {
    if (selectedDevices.size === 0 || !selectedTechId || !pickupDate) return;

    assignMutation.mutate({
      deviceIds: Array.from(selectedDevices),
      technicianId: selectedTechId,
      pickupDate,
    });
  };

  const toggleDevice = (id: string) => {
    const newSet = new Set(selectedDevices);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedDevices(newSet);
  };

  const devices = data?.records || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const filteredDevices = devices.filter((d: Device) =>
    d.serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.donor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/ops" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Operations
        </Link>

          <GradientHeading
            className="text-3xl mb-2"
            variant="navy"
          >
          Unassigned Devices
        </GradientHeading>
        <p className="text-secondary mt-2">
          {data?.total || 0} devices ready for technician assignment
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Actions Bar */}
        <GlassCard>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search by serial, type, or donor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
                />
              </div>
            </div>

            {/* Assign Button */}
            <button
              onClick={() => setShowAssignModal(true)}
              disabled={selectedDevices.size === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedDevices.size > 0
                  ? "accent-gradient text-white hover:shadow"
                  : "bg-surface text-muted cursor-not-allowed border border-default"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Assign {selectedDevices.size > 0 ? `(${selectedDevices.size})` : ""}
            </button>
          </div>
        </GlassCard>

        {/* Devices Table */}
        <GlassCard>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-surface-alt animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted mx-auto mb-4" />
              <p className="text-secondary text-lg">No unassigned devices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-default">
                    <th className="text-left p-3 text-sm font-semibold text-primary">
                      <input
                        type="checkbox"
                        checked={selectedDevices.size === filteredDevices.length && filteredDevices.length > 0}
                        onChange={() => {
                          if (selectedDevices.size === filteredDevices.length) {
                            setSelectedDevices(new Set());
                          } else {
                            setSelectedDevices(new Set(filteredDevices.map((d: Device) => d.id)));
                          }
                        }}
                        className="w-4 h-4 rounded border-default"
                      />
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Serial Number</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Date Received</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Donor</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Condition</th>
                    <th className="text-left p-3 text-sm font-semibold text-primary">Specs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((device: Device, index: number) => (
                    <tr
                      key={device.id}
                      className={`border-b border-default/60 hover:bg-surface-alt transition-colors ${
                        selectedDevices.has(device.id) ? "bg-soft-accent" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedDevices.has(device.id)}
                          onChange={() => toggleDevice(device.id)}
                          className="w-4 h-4 rounded border-default"
                        />
                      </td>
                      <td className="p-3 font-mono text-sm text-primary">{device.serial}</td>
                      <td className="p-3 text-sm text-secondary">{device.type}</td>
                      <td className="p-3 text-sm text-secondary">{device.dateReceived}</td>
                      <td className="p-3 text-sm text-secondary">{device.donor || "—"}</td>
                      <td className="p-3">
                        <span className="inline-flex px-2 py-1 bg-soft-accent text-accent rounded text-xs font-medium">
                          {device.condition}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted">{device.specs || "—"}</td>
                    </tr>
                  ))}
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
                  className="p-2 rounded bg-surface hover:bg-surface-alt border border-default disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded bg-surface hover:bg-surface-alt border border-default disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-default">
            <div className="p-6 border-b border-default">
              <h3 className="text-2xl font-bold text-primary">
                Assign Devices to Technician
              </h3>
              <p className="text-secondary mt-1">
                {selectedDevices.size} device{selectedDevices.size !== 1 ? "s" : ""} selected
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Technician Selection */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3">
                  Select Technician
                </label>
                <div className="space-y-2">
                  {MOCK_TECHNICIANS.map((tech) => (
                    <label
                      key={tech.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTechId === tech.id
                          ? "border-accent bg-soft-accent"
                          : "border-default hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="technician"
                          value={tech.id}
                          checked={selectedTechId === tech.id}
                          onChange={(e) => setSelectedTechId(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="font-semibold text-primary">{tech.name}</div>
                          <div className="text-xs text-secondary">
                            {tech.activeDevices} active • {tech.completionRate}% completion rate
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Expected Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface border-2 border-default rounded-lg focus:outline-none focus-ring text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-default flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTechId("");
                  setPickupDate("");
                }}
                className="px-6 py-3 bg-surface-alt text-secondary rounded-lg font-semibold hover:bg-surface transition-colors border border-default"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDevices}
                disabled={!selectedTechId || !pickupDate || assignMutation.isPending}
                className="px-6 py-3 accent-gradient text-white rounded-lg font-semibold hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {assignMutation.isPending ? "Assigning..." : "Assign Devices"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
