"use client";

import { useEffect, useState } from "react";
import { Search, Download, Plus, Eye, Edit2, ChevronLeft, ChevronRight, Filter } from "lucide-react";

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
  "ready": "bg-green-500/20 text-green-400 border-green-500/30",
  "qa_testing": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "refurbishing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "data_wipe": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "received": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "donated": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "distributed": "bg-hti-teal/20 text-hti-teal border-hti-teal/30",
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
      <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-xl overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="bg-gray-700 h-10 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-700 h-16 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-xl overflow-hidden flex flex-col h-full">
        {/* Enhanced Header with Better Actions */}
        <div className="p-4 md:p-6 bg-gray-900/50 border-b border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Device Inventory</h3>
              <p className="text-sm text-gray-300 mt-1">
                {filteredDevices.length} of {devices.length} devices
                {statusFilter !== "all" && ` • Filtered by ${statusLabels[statusFilter]}`}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleAddDevice}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white text-sm font-medium transition-all hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Device</span>
              </button>
              <button
                onClick={handleExport}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
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
                isSearching ? "text-hti-teal animate-pulse" : "text-gray-300"
              }`} />
              <input
                type="text"
                placeholder="Search serial, model, manufacturer, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-hti-teal focus:ring-2 focus:ring-hti-teal/30 transition-all"
              />
              {searchQuery && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">
                  {filteredDevices.length} results
                </span>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-hti-teal transition-colors appearance-none cursor-pointer"
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
            <thead className="bg-gray-900/50 sticky top-0">
              <tr className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">
                <th className="px-3 md:px-6 py-3">Serial Number</th>
                <th className="px-3 md:px-6 py-3">Device Info</th>
                <th className="px-3 md:px-6 py-3">Status</th>
                <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Assigned To</th>
                <th className="px-3 md:px-6 py-3 hidden md:table-cell">Received</th>
                <th className="px-3 md:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-300">
                    <div className="text-5xl mb-4">
                      {searchQuery || statusFilter !== "all" ? "🔍" : "📦"}
                    </div>
                    {searchQuery || statusFilter !== "all" ? (
                      <>
                        <p className="text-lg font-medium mb-2">No devices match your filters</p>
                        <p className="text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="mt-4 px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          Clear Filters
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2">No devices in inventory</p>
                        <p className="text-sm mb-4">
                          Get started by adding your first device
                        </p>
                        <button
                          onClick={handleAddDevice}
                          className="px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
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
                    className="hover:bg-gray-750 transition-colors border-l-4 border-l-transparent hover:border-l-hti-teal cursor-pointer"
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-white">{device.serial_number}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm font-medium text-white">{device.model}</div>
                      <div className="text-xs text-gray-300">{device.manufacturer}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusColors[device.status] || statusColors.received}`}>
                        {statusLabels[device.status] || device.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-300">{device.assigned_to || "—"}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(device.received_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDevice(device);
                          }}
                          className="text-hti-teal hover:text-hti-teal-light transition-colors"
                          aria-label="View device details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edit device: ${device.serial_number}`);
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
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
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            Showing <span className="font-medium text-white">{filteredDevices.length}</span> of{" "}
            <span className="font-medium text-white">{devices.length}</span> devices
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-2 bg-gray-700 rounded text-gray-300 cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-gray-700 rounded text-white text-sm">1</span>
            <button
              disabled
              className="p-2 bg-gray-700 rounded text-gray-300 cursor-not-allowed"
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
            className="bg-gray-800 border border-gray-600 rounded-2xl max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Device Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">Serial Number</span>
                  <p className="text-white font-mono mt-1">{selectedDevice.serial_number}</p>
                </div>
                <div>
                  <span className="text-gray-300">Model</span>
                  <p className="text-white mt-1">{selectedDevice.model}</p>
                </div>
                <div>
                  <span className="text-gray-300">Manufacturer</span>
                  <p className="text-white mt-1">{selectedDevice.manufacturer}</p>
                </div>
                <div>
                  <span className="text-gray-300">Status</span>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusColors[selectedDevice.status]}`}>
                      {statusLabels[selectedDevice.status]}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-300">Location</span>
                  <p className="text-white mt-1">{selectedDevice.location}</p>
                </div>
                <div>
                  <span className="text-gray-300">Assigned To</span>
                  <p className="text-white mt-1">{selectedDevice.assigned_to || "Unassigned"}</p>
                </div>
                <div>
                  <span className="text-gray-300">Received Date</span>
                  <p className="text-white mt-1">
                    {new Date(selectedDevice.received_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex gap-3">
              <button
                onClick={() => {
                  alert(`Editing ${selectedDevice.serial_number}`);
                  setSelectedDevice(null);
                }}
                className="flex-1 px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white font-medium transition-colors"
              >
                Edit Device
              </button>
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
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
