"use client";

import { useEffect, useState } from "react";
import { getDeviceStatusColor, getDeviceStatusLabel } from "@/lib/utils/status-colors";

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
    (device.serial_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.model || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (getDeviceStatusLabel(device.status) || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-hti-yellow/50 shadow-xl overflow-hidden">
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

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-hti-yellow/50 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header with Search */}
      <div className="p-4 md:p-6 bg-hti-red/15 border-b border-hti-yellow/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-white">💾 Device Inventory</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gradient-to-r from-hti-red to-hti-orange hover:shadow-lg rounded-lg text-white text-xs md:text-sm font-bold transition-all hover:scale-105">
              + Add Device
            </button>
            <button className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-hti-yellow text-xs md:text-sm font-bold transition-all border border-hti-yellow/50">
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search serial, model, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 md:px-4 py-2 bg-hti-navy/30 border border-hti-yellow/50 rounded-lg text-white placeholder-hti-yellow text-sm focus:outline-none focus:border-hti-yellow transition-all focus:bg-hti-navy/50"
          />
          <button className="px-3 md:px-4 py-2 bg-hti-orange hover:bg-hti-red rounded-lg text-white text-xs md:text-sm font-bold transition-all whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-hti-navy/50 sticky top-0">
            <tr className="text-left text-xs font-bold text-hti-yellow uppercase tracking-wider border-b border-hti-yellow/50">
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
                  <div className="text-3xl mb-2">🔍</div>
                  <p>No devices found</p>
                </td>
              </tr>
            ) : (
              filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-750 transition-colors border-l-4 border-l-transparent hover:border-l-hti-teal">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-mono text-white break-words md:break-normal">{device.serial_number}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div className="text-xs md:text-sm font-medium text-white">{device.model}</div>
                    <div className="text-xs text-gray-300">{device.manufacturer}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border inline-block ${getDeviceStatusColor(device.status)}`}>
                      {getDeviceStatusLabel(device.status)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                    <div className="text-xs md:text-sm text-gray-300">{device.assigned_to || "—"}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                    <div className="text-xs md:text-sm text-gray-300">
                      {new Date(device.received_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-xs md:text-sm text-hti-teal hover:text-hti-teal-light transition-colors">
                        Edit
                      </button>
                      <span className="text-gray-400">|</span>
                      <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
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

      {/* Footer Pagination */}
      <div className="p-3 md:p-4 bg-gray-900/50 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs md:text-sm text-gray-300">
          Showing <span className="font-medium">{filteredDevices.length}</span> of <span className="font-medium">{devices.length}</span> devices
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs md:text-sm text-white transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs md:text-sm text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
