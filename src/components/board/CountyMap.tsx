"use client";

interface County {
  name: string;
  devices: number;
  status: "active" | "high" | "moderate";
}

const counties: County[] = [
  { name: "Vance", devices: 245, status: "high" },
  { name: "Warren", devices: 198, status: "high" },
  { name: "Halifax", devices: 312, status: "high" },
  { name: "Northampton", devices: 156, status: "moderate" },
  { name: "Hertford", devices: 134, status: "moderate" },
  { name: "Gates", devices: 89, status: "moderate" },
  { name: "Bertie", devices: 167, status: "moderate" },
  { name: "Martin", devices: 201, status: "high" },
  { name: "Washington", devices: 98, status: "moderate" },
  { name: "Tyrrell", devices: 67, status: "active" },
  { name: "Dare", devices: 178, status: "moderate" },
  { name: "Hyde", devices: 54, status: "active" },
  { name: "Beaufort", devices: 223, status: "high" },
  { name: "Pitt", devices: 289, status: "high" },
  { name: "Edgecombe", devices: 189, status: "moderate" },
];

const statusColors = {
  high: "bg-hti-red text-white",
  moderate: "bg-hti-teal text-white",
  active: "bg-hti-navy text-white",
};

const statusLabels = {
  high: "High Impact",
  moderate: "Growing",
  active: "Active",
};

export default function CountyMap() {
  const totalDevices = counties.reduce((sum, county) => sum + county.devices, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          15 Counties Served
        </h3>
        <p className="text-sm text-gray-600">
          Digital Champion Grant distribution footprint
        </p>
      </div>

      {/* County List */}
      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {counties.map((county) => (
          <div
            key={county.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[county.status]}`}>
                {statusLabels[county.status]}
              </div>
              <span className="font-medium text-gray-900">{county.name} County</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {county.devices} devices
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-hti-navy">{totalDevices}</div>
            <div className="text-xs text-gray-600">Total Devices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-hti-teal">15</div>
            <div className="text-xs text-gray-600">Counties</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-hti-red">{Math.round(totalDevices / 15)}</div>
            <div className="text-xs text-gray-600">Avg/County</div>
          </div>
        </div>
      </div>
    </div>
  );
}
