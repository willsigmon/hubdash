"use client";

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
  "ready": "bg-green-500/20 text-green-400 border-green-500/30",
  "qa_testing": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "refurbishing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "data_wipe": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "received": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "donated": "bg-gray-500/20 text-gray-400 border-gray-500/30",
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

export default function InventoryOverview() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => {
        setDevices(data.slice(0, 10)); // Show first 10
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setLoading(false);
      });
  }, []);

  const filteredDevices = devices.filter(device =>
    device.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    statusLabels[device.status]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
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
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header with Search */}
      <div className="p-6 bg-gray-900/50 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Device Inventory</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white text-sm font-medium transition-colors">
              + Add Device
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
              Export
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by serial number, model, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-hti-teal transition-colors"
          />
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors">
            🔍 Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3">Serial Number</th>
              <th className="px-6 py-3">Device Info</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Received</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No devices found
                </td>
              </tr>
            ) : (
              filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-white">{device.serial_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{device.model}</div>
                    <div className="text-xs text-gray-400">{device.manufacturer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[device.status] || statusColors.received}`}>
                      {statusLabels[device.status] || device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">{device.assigned_to || "Unassigned"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {new Date(device.received_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-hti-teal hover:text-hti-teal-light mr-3">
                      Edit
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredDevices.length} of {devices.length} devices
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
