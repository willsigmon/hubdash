"use client";

import { useMemo, useState } from "react";
import { useDevices, useMetrics } from "@/lib/hooks/useMetrics";
import { getDeviceStatusColor, getDeviceStatusLabel } from "@/lib/utils/status-colors";
import EmptyState from "@/components/ui/EmptyState";

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

  const { data: metricsData } = useMetrics();

  // Use React Query hook with proper status filtering
  const apiStatusFilter = statusFilter !== "all" ? statusFilter : undefined;
  const { data: devicesResponse, isLoading, isError } = useDevices(
    currentPage,
    PAGE_LIMIT,
    apiStatusFilter
  );

  const devices = devicesResponse?.data ?? [];
  const pagination = devicesResponse?.pagination ?? {
    page: currentPage,
    limit: PAGE_LIMIT,
    hasMore: false,
    total: null,
  };

  const statusOptions = useMemo(() => {
    const unique = new Set<string>();
    devices.forEach((device) => {
      if (device.status) {
        unique.add(getDeviceStatusLabel(device.status));
      }
    });

    const pipelineStatusMap: Record<string, string> = {
      donated: "Donated",
      received: "Received",
      dataWipe: "Data Wipe",
      refurbishing: "Refurbishing",
      qaTesting: "QA Testing",
      ready: "Ready to Ship",
      distributed: "Distributed",
    };

    if (metricsData?.pipeline) {
      Object.keys(metricsData.pipeline).forEach((key) => {
        const label = pipelineStatusMap[key as keyof typeof pipelineStatusMap];
        if (label) {
          unique.add(label);
        }
      });
    }

    return Array.from(unique).sort();
  }, [devices, metricsData?.pipeline]);

  const filteredDevices = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    // Client-side filtering for search (status filtering happens server-side)
    const filtered = devices.filter((device) => {
      if (term.length === 0) {
        return true;
      }

      const statusLabel = getDeviceStatusLabel(device.status);
      return (
        (device.serial_number || "").toLowerCase().includes(term) ||
        (device.model || "").toLowerCase().includes(term) ||
        (device.manufacturer || "").toLowerCase().includes(term) ||
        statusLabel.toLowerCase().includes(term)
      );
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

  const isSearching = searchQuery.trim().length > 0;

  const showingStart =
    filteredDevices.length === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const showingEnd =
    filteredDevices.length === 0
      ? 0
      : showingStart + filteredDevices.length - 1;

  const totalDisplay = pagination.total ?? showingEnd;

  const handlePrev = () => {
    if (pagination.page <= 1) return;
    setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (!pagination.hasMore) return;
    setCurrentPage(prev => prev + 1);
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

  if (isLoading) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="bg-white/10 h-11 rounded mb-5" />
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white/10 h-16 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<span role="img" aria-label="inventory">💾</span>}
        title="Device inventory is temporarily unavailable"
        description="Knack throttled requests earlier today. We’ll refresh these rows as soon as new API quota is available."
        actionLabel="Reload"
        onAction={() => window.location.reload()}
        tone="warning"
      />
    );
  }

  return (
    <div className="glass-card glass-card--subtle shadow-glass flex flex-col h-full">
      <div className="p-4 md:p-6 border-b glass-divider">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-glass-bright flex items-center gap-2">
              💾 Device Inventory
            </h3>
            <p className="text-sm text-glass-muted mt-1">
              Track live pipeline devices, surface bottlenecks, and take action fast.
            </p>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button className="glass-button glass-button--accent text-sm" type="button" disabled>
              Coming Soon
            </button>
            <button
              className="glass-button text-sm"
              type="button"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search serial, model, manufacturer, status..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="glass-input text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="glass-input glass-input--select text-sm"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="glass-input glass-input--select text-sm"
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
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            disabled={!searchQuery}
            className="glass-button text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr className="text-left text-xs font-semibold text-glass-muted tracking-wider">
              <th className="px-3 md:px-6 py-3">Serial number</th>
              <th className="px-3 md:px-6 py-3">Device info</th>
              <th className="px-3 md:px-6 py-3">Status</th>
              <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Assigned to</th>
              <th className="px-3 md:px-6 py-3 hidden md:table-cell">Received</th>
              <th className="px-3 md:px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-glass-muted">
                  <div className="text-3xl mb-2">🔍</div>
                  <p>No devices found</p>
                </td>
              </tr>
            ) : (
              filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  className="transition-colors border-l-4 border-l-transparent hover:border-l-hti-orange hover:bg-white/10"
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-mono text-glass-bright break-words md:break-normal">
                      {device.serial_number || "—"}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div className="text-xs md:text-sm font-semibold text-glass-bright">
                      {device.model || "—"}
                    </div>
                    <div className="text-xs text-glass-muted">{device.manufacturer || "Unknown"}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <span className={`${getDeviceStatusColor(device.status)} text-xs md:text-sm`}>
                      {getDeviceStatusLabel(device.status)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                    <div className="text-xs md:text-sm text-glass-muted">{device.assigned_to || "—"}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                    <div className="text-xs md:text-sm text-glass-muted">
                      {device.received_date ? new Date(device.received_date).toLocaleDateString() : "—"}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-xs md:text-sm text-glass-muted hover:text-glass-bright transition-colors focus:outline-none focus:ring-2 focus:ring-hti-yellow rounded">
                        Edit
                      </button>
                      <span className="text-glass-muted/60">|</span>
                      <button className="text-xs md:text-sm text-glass-muted hover:text-glass-bright transition-colors focus:outline-none focus:ring-2 focus:ring-hti-yellow rounded">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 md:p-5 glass-divider flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs md:text-sm text-glass-muted">
          Showing <span className="text-glass-bright font-semibold">{showingStart}</span>
          {filteredDevices.length === 0 ? "" : `–${showingEnd}`}
          {" of "}
          <span className="text-glass-bright font-semibold">{totalDisplay}</span> devices
        </div>
        <div className="flex gap-2">
          <button
            className="glass-button text-xs md:text-sm"
            aria-label="Previous page of devices"
            onClick={handlePrev}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <button
            className="glass-button text-xs md:text-sm"
            aria-label="Next page of devices"
            onClick={handleNext}
            disabled={!pagination.hasMore}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
