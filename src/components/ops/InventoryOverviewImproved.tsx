"use client";

import { ChevronLeft, ChevronRight, Download, Edit2, Eye, Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

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

const statusColors: Record<string, string> = {
  "ready": "bg-soft-success text-success border-success/30",
  "qa_testing": "bg-soft-warning text-warning border-warning/30",
  "refurbishing": "bg-soft-accent text-accent border-accent/30",
  "data_wipe": "bg-soft-accent text-accent border-accent/30",
  "received": "bg-soft-accent text-accent border-accent/30",
  "donated": "bg-soft-accent text-accent border-accent/30",
  "distributed": "bg-soft-success text-success border-success/30",
};

const statusLabels: Record<string, string> = {
  "ready": "Ready to Ship",
  "qa_testing": "QA Testing",
  "refurbishing": "Refurbishing",
  "data_wipe": "Data Wipe",
  "received": "Received",
  "donated": "Donated",
  "distributed": "Distributed",
};

export default function InventoryOverviewImproved() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => {
        setDevices(data.slice(0, 10));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setLoading(false);
      });
  }, []);

  // Simulate search with debounce
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const filteredDevices = devices.filter(device => {
    const matchesSearch =
      device.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusLabels[device.status]?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    // TODO: Implement actual export
    alert("Export feature coming soon! This will download a CSV of all devices.");
  };

  const handleAddDevice = () => {
    // TODO: Open add device modal
    alert("Add Device modal would open here");
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-xl border border-default shadow overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="bg-surface-alt h-10 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface-alt h-16 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface rounded-xl border border-default shadow overflow-hidden flex flex-col h-full">
        {/* Enhanced Header with Better Actions */}
        <div className="p-4 md:p-6 bg-surface-alt border-b border-default">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-primary">Device Inventory</h3>
              <p className="text-sm text-secondary mt-1">
                {filteredDevices.length} of {devices.length} devices
                {statusFilter !== "all" && ` • Filtered by ${statusLabels[statusFilter]}`}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleAddDevice}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 accent-gradient rounded-lg text-on-accent text-sm font-medium transition-all hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Device</span>
              </button>
              <button
                onClick={handleExport}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface hover:bg-surface-alt rounded-lg text-primary text-sm font-medium transition-colors border border-default"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Improved Search with Visual Feedback */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isSearching ? "text-warning animate-pulse" : "text-muted"
              }`} />
              <input
                type="text"
                placeholder="Search serial, model, manufacturer, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-default rounded-lg text-primary placeholder:text-muted text-sm focus:outline-none focus-ring transition-all"
              />
              {searchQuery && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary">
                  {filteredDevices.length} results
                </span>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-surface border border-default rounded-lg text-primary text-sm focus:outline-none focus-ring transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt sticky top-0">
              <tr className="text-left text-xs font-medium text-secondary uppercase tracking-wider border-b border-default">
                <th className="px-3 md:px-6 py-3">Serial Number</th>
                <th className="px-3 md:px-6 py-3">Device Info</th>
                <th className="px-3 md:px-6 py-3">Status</th>
                <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Assigned To</th>
                <th className="px-3 md:px-6 py-3 hidden md:table-cell">Received</th>
                <th className="px-3 md:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default/60">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondary">
                    <div className="text-5xl mb-4">
                      {searchQuery || statusFilter !== "all" ? "🔍" : "📦"}
                    </div>
                    {searchQuery || statusFilter !== "all" ? (
                      <>
                        <p className="text-lg font-medium mb-2 text-primary">No devices match your filters</p>
                        <p className="text-sm text-secondary">
                          Try adjusting your search or filter criteria
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="mt-4 px-4 py-2 accent-gradient rounded-lg text-on-accent text-sm font-medium transition-colors"
                        >
                          Clear Filters
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2 text-primary">No devices in inventory</p>
                        <p className="text-sm mb-4 text-secondary">
                          Get started by adding your first device
                        </p>
                        <button
                          onClick={handleAddDevice}
                          className="px-4 py-2 accent-gradient rounded-lg text-on-accent text-sm font-medium transition-colors inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Device
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="hover:bg-surface-alt transition-colors border-l-4 border-l-transparent hover:border-l-accent cursor-pointer"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-primary">{device.serial_number}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm font-medium text-primary">{device.model}</div>
                      <div className="text-xs text-secondary">{device.manufacturer}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusColors[device.status] || statusColors.received}`}>
                        {statusLabels[device.status] || device.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-secondary">{device.assigned_to || "—"}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                      <div className="text-sm text-secondary">
                        {typeof window !== 'undefined' && device.received_date ? new Date(device.received_date).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDevice(device);
                          }}
                          className="text-warning hover:text-accent transition-colors"
                          aria-label="View device details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edit device: ${device.serial_number}`);
                          }}
                          className="text-muted hover:text-primary transition-colors"
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

        {/* Enhanced Footer with Pagination */}
        <div className="p-4 bg-surface-alt border-t border-default flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-secondary">
            Showing <span className="font-medium text-primary">{filteredDevices.length}</span> of{" "}
            <span className="font-medium text-primary">{devices.length}</span> devices
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-2 bg-surface rounded text-muted cursor-not-allowed border border-default"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-surface rounded text-primary text-sm border border-default">1</span>
            <button
              disabled
              className="p-2 bg-surface rounded text-muted cursor-not-allowed border border-default"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedDevice(null)}
        >
          <div
            className="bg-surface border border-default rounded-2xl max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-default">
              <h2 className="text-2xl font-bold text-primary">Device Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary">Serial Number</span>
                  <p className="text-primary font-mono mt-1">{selectedDevice.serial_number}</p>
                </div>
                <div>
                  <span className="text-secondary">Model</span>
                  <p className="text-primary mt-1">{selectedDevice.model}</p>
                </div>
                <div>
                  <span className="text-secondary">Manufacturer</span>
                  <p className="text-primary mt-1">{selectedDevice.manufacturer}</p>
                </div>
                <div>
                  <span className="text-secondary">Status</span>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusColors[selectedDevice.status]}`}>
                      {statusLabels[selectedDevice.status]}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-secondary">Location</span>
                  <p className="text-primary mt-1">{selectedDevice.location}</p>
                </div>
                <div>
                  <span className="text-secondary">Assigned To</span>
                  <p className="text-primary mt-1">{selectedDevice.assigned_to || "Unassigned"}</p>
                </div>
                <div>
                  <span className="text-secondary">Received Date</span>
                  <p className="text-primary mt-1">
                    {typeof window !== 'undefined' && selectedDevice.received_date ? new Date(selectedDevice.received_date).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-default flex gap-3">
              <button
                onClick={() => {
                  alert(`Editing ${selectedDevice.serial_number}`);
                  setSelectedDevice(null);
                }}
                className="flex-1 px-4 py-2 accent-gradient rounded-lg text-on-accent font-medium transition-colors"
              >
                Edit Device
              </button>
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 bg-surface-alt hover:bg-surface rounded-lg text-primary font-medium transition-colors border border-default"
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
