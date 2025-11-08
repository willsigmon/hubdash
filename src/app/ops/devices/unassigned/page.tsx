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
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-gray to-hti-navy/90 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/ops" className="inline-flex items-center gap-2 text-hti-yellow hover:text-hti-gold mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Operations
        </Link>

        <GradientHeading
          from="from-blue-500"
          to="to-blue-700"
        >
          Unassigned Devices
        </GradientHeading>
        <p className="text-hti-mist mt-2">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-hti-stone" />
                <input
                  type="text"
                  placeholder="Search by serial, type, or donor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-hti-fig/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-hti-plum placeholder-hti-stone/50"
                />
              </div>
            </div>

            {/* Assign Button */}
            <button
              onClick={() => setShowAssignModal(true)}
              disabled={selectedDevices.size === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedDevices.size > 0
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl"
                  : "bg-hti-stone/20 text-hti-stone/50 cursor-not-allowed"
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
                <div key={i} className="h-16 bg-white/20 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-hti-stone/30 mx-auto mb-4" />
              <p className="text-hti-stone text-lg">No unassigned devices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hti-fig/10">
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">
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
                        className="w-4 h-4 rounded border-hti-fig/20"
                      />
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Serial Number</th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Date Received</th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Donor</th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Condition</th>
                    <th className="text-left p-3 text-sm font-semibold text-hti-plum">Specs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map((device: Device, index: number) => (
                    <tr
                      key={device.id}
                      className={`border-b border-hti-fig/5 hover:bg-white/30 transition-colors ${
                        selectedDevices.has(device.id) ? "bg-blue-500/10" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedDevices.has(device.id)}
                          onChange={() => toggleDevice(device.id)}
                          className="w-4 h-4 rounded border-hti-fig/20"
                        />
                      </td>
                      <td className="p-3 font-mono text-sm text-hti-plum">{device.serial}</td>
                      <td className="p-3 text-sm text-hti-stone">{device.type}</td>
                      <td className="p-3 text-sm text-hti-stone">{device.dateReceived}</td>
                      <td className="p-3 text-sm text-hti-stone">{device.donor || "—"}</td>
                      <td className="p-3">
                        <span className="inline-flex px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs font-medium">
                          {device.condition}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-hti-stone/70">{device.specs || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-hti-fig/10">
              <div className="text-sm text-hti-stone">
                Page {page} of {totalPages} ({data?.total} total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded bg-white/50 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-hti-plum" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded bg-white/50 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-hti-plum" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-hti-fig/10">
              <h3 className="text-2xl font-bold text-hti-plum">
                Assign Devices to Technician
              </h3>
              <p className="text-hti-stone mt-1">
                {selectedDevices.size} device{selectedDevices.size !== 1 ? "s" : ""} selected
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Technician Selection */}
              <div>
                <label className="block text-sm font-semibold text-hti-plum mb-3">
                  Select Technician
                </label>
                <div className="space-y-2">
                  {MOCK_TECHNICIANS.map((tech) => (
                    <label
                      key={tech.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTechId === tech.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-hti-fig/20 hover:border-blue-500/50"
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
                          <div className="font-semibold text-hti-plum">{tech.name}</div>
                          <div className="text-xs text-hti-stone">
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
                <label className="block text-sm font-semibold text-hti-plum mb-2">
                  Expected Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-hti-stone" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-hti-fig/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-hti-plum"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-hti-fig/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTechId("");
                  setPickupDate("");
                }}
                className="px-6 py-3 bg-hti-stone/20 text-hti-stone rounded-lg font-semibold hover:bg-hti-stone/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDevices}
                disabled={!selectedTechId || !pickupDate || assignMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
