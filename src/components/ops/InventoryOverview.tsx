"use client";

interface Device {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  status: string;
  location: string;
  assignedTo: string;
  receivedDate: string;
}

const devices: Device[] = [
  {
    id: "1",
    serialNumber: "HTI-2024-1523",
    model: "ThinkPad X1 Carbon",
    manufacturer: "Lenovo",
    status: "Ready to Ship",
    location: "Henderson Warehouse",
    assignedTo: "Vance County Schools",
    receivedDate: "2024-11-01",
  },
  {
    id: "2",
    serialNumber: "HTI-2024-1524",
    model: "Latitude 7420",
    manufacturer: "Dell",
    status: "QA Testing",
    location: "Henderson Warehouse",
    assignedTo: "Unassigned",
    receivedDate: "2024-11-02",
  },
  {
    id: "3",
    serialNumber: "HTI-2024-1525",
    model: "EliteBook 840",
    manufacturer: "HP",
    status: "Refurbishing",
    location: "Henderson Warehouse",
    assignedTo: "Unassigned",
    receivedDate: "2024-10-28",
  },
  {
    id: "4",
    serialNumber: "HTI-2024-1526",
    model: "MacBook Pro 2019",
    manufacturer: "Apple",
    status: "Data Wipe",
    location: "Henderson Warehouse",
    assignedTo: "Unassigned",
    receivedDate: "2024-11-03",
  },
  {
    id: "5",
    serialNumber: "HTI-2024-1527",
    model: "ThinkPad T480",
    manufacturer: "Lenovo",
    status: "Ready to Ship",
    location: "Henderson Warehouse",
    assignedTo: "Warren County Library",
    receivedDate: "2024-10-30",
  },
];

const statusColors: Record<string, string> = {
  "Ready to Ship": "bg-green-500/20 text-green-400 border-green-500/30",
  "QA Testing": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Refurbishing": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Data Wipe": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Received": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function InventoryOverview() {
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
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-white">{device.serialNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">{device.model}</div>
                  <div className="text-xs text-gray-400">{device.manufacturer}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[device.status]}`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300">{device.assignedTo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{device.receivedDate}</div>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing 1-5 of 127 devices
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
