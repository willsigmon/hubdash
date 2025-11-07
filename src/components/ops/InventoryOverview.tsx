"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Download, Plus, Eye, Edit2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useDevices, useMetrics } from "@/lib/hooks/useMetrics";
import { useQueryClient } from "@tanstack/react-query";
import { getDeviceStatusColor, getDeviceStatusLabel } from "@/lib/utils/status-colors";
import DataPauseNotice from "@/components/ui/DataPauseNotice";
import { interpretKnackError } from "@/lib/utils/knack-messaging";
import { queryKeys } from "@/lib/query-client";

interface Device {
  id: string;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  location: string;
  assigned_to: string | null;
  received_date: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number | null;
}

const PAGE_LIMIT = 25;

export default function InventoryOverview() {
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("received_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: metricsData } = useMetrics();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!searchQuery) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const apiStatusFilter = statusFilter !== "all" ? statusFilter : undefined;
  const { data: devicesResponse, isLoading, isError, error } = useDevices(
    currentPage,
    PAGE_LIMIT,
    apiStatusFilter
  );

  const devices = devicesResponse?.data ?? [];
  const pagination: PaginationMeta = devicesResponse?.pagination ?? {
    page: currentPage,
    limit: PAGE_LIMIT,
    hasMore: false,
    total: null,
  };

  const statusOptions = useMemo(() => {
    const seen = new Map<string, string>();

    devices.forEach((device) => {
      if (device.status) {
        seen.set(device.status, getDeviceStatusLabel(device.status));
      }
    });

    const pipelineKeyMap: Record<string, string> = {
      donated: "donated",
      received: "received",
      dataWipe: "data_wipe",
      refurbishing: "refurbishing",
      qaTesting: "qa_testing",
      ready: "ready",
      distributed: "distributed",
    };

    Object.entries(pipelineKeyMap).forEach(([metricKey, statusKey]) => {
      if ((metricsData?.pipeline as Record<string, number> | undefined)?.[metricKey] && !seen.has(statusKey)) {
        seen.set(statusKey, getDeviceStatusLabel(statusKey));
      }
    });

    return Array.from(seen.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [devices, metricsData?.pipeline]);

  const filteredDevices = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    const filtered = devices.filter((device) => {
      const statusLabel = getDeviceStatusLabel(device.status);

      if (term.length > 0) {
        const haystack = [
          device.serial_number || "",
          device.model || "",
          device.manufacturer || "",
          statusLabel,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "serial_asc":
          return (a.serial_number || "").localeCompare(b.serial_number || "");
        case "serial_desc":
          return (b.serial_number || "").localeCompare(a.serial_number || "");
        case "model_asc":
          return (a.model || "").localeCompare(b.model || "");
        case "model_desc":
          return (b.model || "").localeCompare(a.model || "");
        case "status_asc":
          return getDeviceStatusLabel(a.status).localeCompare(getDeviceStatusLabel(b.status));
        case "status_desc":
          return getDeviceStatusLabel(b.status).localeCompare(getDeviceStatusLabel(a.status));
        case "received_asc":
          return new Date(a.received_date).getTime() - new Date(b.received_date).getTime();
        case "received_desc":
        default:
          return new Date(b.received_date).getTime() - new Date(a.received_date).getTime();
      }
    });

    return sorted;
  }, [devices, searchQuery, sortOption]);

  const showingStart =
    filteredDevices.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingEnd =
    filteredDevices.length === 0 ? 0 : showingStart + filteredDevices.length - 1;
  const totalDisplay = pagination.total ?? showingEnd;

  const handlePrev = () => {
    if (pagination.page <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!pagination.hasMore) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch(`/api/devices?page=1&limit=500`);
      const payload = await response.json();
      const devicesList = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      const columns = [
        "Serial Number",
        "Model",
        "Manufacturer",
        "Status",
        "Location",
        "Assigned To",
        "Received",
      ];

      const rows = devicesList.map((device: Device) => [
        device.serial_number ?? "",
        device.model ?? "",
        device.manufacturer ?? "",
        getDeviceStatusLabel(device.status),
        device.location ?? "",
        device.assigned_to ?? "",
        device.received_date ? new Date(device.received_date).toLocaleDateString() : "",
      ]);

      const csvContent = [columns, ...rows]
        .map((line) => line.map((value: unknown) => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hti-device-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleAddDevice = () => {
    alert("Device intake workflow is coming soon. Capture donors directly from HUBDash soon!\n\nIn the meantime, continue logging new devices in Knack.");
  };

  if (isLoading) {
    return (
      <div className="bg-hti-midnight rounded-xl border border-white/15 shadow-xl overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="bg-white/10 h-10 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/10 h-16 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const knackMessage = interpretKnackError(error instanceof Error ? error.message : String(error ?? ""));
    return (
      <DataPauseNotice
        icon={<span role="img" aria-label="device">💾</span>}
        tone="warning"
        title={knackMessage.title}
        message={knackMessage.message}
        detail={knackMessage.detail}
        actionLabel="Retry fetch"
        onAction={() => queryClient.invalidateQueries({ queryKey: queryKeys.devicesPaginated(currentPage, PAGE_LIMIT, apiStatusFilter) })}
      />
    );
  }

  return (
    <>
      <div className="bg-hti-midnight rounded-2xl border border-white/12 shadow-xl overflow-hidden flex flex-col h-full">
        <div className="p-4 md:p-6 bg-hti-midnight/85 border-b border-white/10 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-hti-sand/60 font-semibold">Inventory</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl" role="img" aria-hidden>💾</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Device Inventory</h3>
              </div>
              <p className="text-sm text-hti-sand/80 mt-1">
                {filteredDevices.length} of {devices.length} devices on page {pagination.page}
                {statusFilter !== "all" && ` • Filtered by ${getDeviceStatusLabel(statusFilter)}`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={handleAddDevice}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-hti-ember text-white text-sm font-semibold shadow-lg shadow-hti-ember/30 hover:-translate-y-[1px] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Device
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/15 hover:bg-white/20 transition-all disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exporting…" : "Export CSV"}
              </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearching ? "text-hti-gold animate-pulse" : "text-hti-sand/70"
                  }`}
              />
              <input
                type="text"
                placeholder="Search serial, model, manufacturer, status..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-hti-midnight border border-white/15 text-white placeholder-hti-sand/70 text-sm focus:outline-none focus:ring-2 focus:ring-hti-ember/40"
              />
              {searchQuery && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hti-sand/70">
                  {filteredDevices.length} results
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hti-sand/60" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-hti-midnight border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-hti-ember/40 appearance-none"
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="flex-1 pl-4 pr-3 py-2.5 rounded-xl bg-hti-midnight border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-hti-ember/40"
              >
                <option value="received_desc">Received date · newest</option>
                <option value="received_asc">Received date · oldest</option>
                <option value="serial_asc">Serial number · A → Z</option>
                <option value="serial_desc">Serial number · Z → A</option>
                <option value="model_asc">Model · A → Z</option>
                <option value="model_desc">Model · Z → A</option>
                <option value="status_asc">Status · A → Z</option>
                <option value="status_desc">Status · Z → A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-hti-midnight/80 sticky top-0">
              <tr className="text-left text-xs font-semibold text-hti-sand/70 tracking-[0.18em] border-b border-white/10">
                <th className="px-3 md:px-6 py-3">Serial Number</th>
                <th className="px-3 md:px-6 py-3">Device Info</th>
                <th className="px-3 md:px-6 py-3">Status</th>
                <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Assigned To</th>
                <th className="px-3 md:px-6 py-3 hidden md:table-cell">Received</th>
                <th className="px-3 md:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-hti-sand/80">
                    <div className="text-4xl mb-2">
                      {searchQuery || statusFilter !== "all" ? "🔍" : "📦"}
                    </div>
                    <p className="text-lg font-semibold">
                      {searchQuery || statusFilter !== "all" ? "No devices match your filters" : "No devices in inventory"}
                    </p>
                    <p className="text-sm mt-1">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search keywords or clearing filters."
                        : "Add your first device from the field operations intake."}
                    </p>
                    {(searchQuery || statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="mt-4 px-4 py-2 rounded-lg bg-hti-ember text-white text-sm font-semibold"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="border-l-4 border-l-transparent hover:border-l-hti-ember/70 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-mono text-white break-words md:break-normal">
                        {device.serial_number || "—"}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm font-semibold text-white">{device.model || "—"}</div>
                      <div className="text-xs text-hti-sand/70">{device.manufacturer || "Unknown"}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`${getDeviceStatusColor(device.status)} text-xs font-semibold`}>
                        {getDeviceStatusLabel(device.status)}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-hti-sand/70">{device.assigned_to || "—"}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                      <div className="text-sm text-hti-sand/70">
                        {device.received_date ? new Date(device.received_date).toLocaleDateString() : "—"}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-hti-sand/70">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedDevice(device);
                          }}
                          className="hover:text-white transition-colors"
                          aria-label="View device details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            alert(`Edit workflow coming soon for ${device.serial_number || "this device"}`);
                          }}
                          className="hover:text-white transition-colors"
                          aria-label="Edit device"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 md:p-5 bg-hti-midnight/85 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs md:text-sm text-hti-sand/70">
            Showing <span className="text-white font-semibold">{filteredDevices.length === 0 ? 0 : showingStart}</span>
            {filteredDevices.length > 0 && `–${showingEnd}`} of
            <span className="text-white font-semibold"> {totalDisplay}</span> devices
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pagination.page === 1}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm font-semibold">
              Page {pagination.page}
            </span>
            <button
              onClick={handleNext}
              disabled={!pagination.hasMore}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedDevice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDevice(null)}>
          <div
            className="bg-hti-midnight border border-white/12 rounded-2xl max-w-2xl w-full shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Device Details</h2>
              <p className="text-sm text-hti-sand/70 mt-1">Serial: {selectedDevice.serial_number || "—"}</p>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Model" value={selectedDevice.model || "—"} />
                <DetailItem label="Manufacturer" value={selectedDevice.manufacturer || "—"} />
                <DetailItem label="Status" value={getDeviceStatusLabel(selectedDevice.status)} />
                <DetailItem label="Location" value={selectedDevice.location || "—"} />
                <DetailItem label="Assigned To" value={selectedDevice.assigned_to || "Unassigned"} />
                <DetailItem
                  label="Received Date"
                  value={selectedDevice.received_date ? new Date(selectedDevice.received_date).toLocaleDateString() : "—"}
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  alert(`Editing ${selectedDevice.serial_number || "device"} coming soon.`);
                  setSelectedDevice(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-hti-ember text-white font-semibold"
              >
                Edit Device
              </button>
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-3 rounded-xl bg-white/10 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-hti-sand/60 text-xs uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
