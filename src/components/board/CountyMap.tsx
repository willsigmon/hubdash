"use client";

import { useEffect, useState } from "react";

interface County {
  name: string;
  devices: number;
  status: "active" | "high" | "moderate";
}

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
  const [counties, setCounties] = useState<County[]>([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        // Group by county and sum devices
        const countyMap = new Map<string, number>();
        data.forEach((partner: any) => {
          const county = partner.county || 'Unknown';
          const current = countyMap.get(county) || 0;
          countyMap.set(county, current + (partner.devices_received || 0));
        });

        // Convert to array and determine status
        const countiesData = Array.from(countyMap.entries()).map(([name, devices]) => {
          let status: "active" | "high" | "moderate";
          if (devices >= 250) status = "high";
          else if (devices >= 150) status = "moderate";
          else status = "active";

          return { name, devices, status };
        }).sort((a, b) => b.devices - a.devices);

        const total = countiesData.reduce((sum, c) => sum + c.devices, 0);

        setCounties(countiesData);
        setTotalDevices(total);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching county data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Counties Served
          </h3>
          <p className="text-sm text-gray-600">
            Digital Champion Grant distribution footprint
          </p>
        </div>
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {counties.length} Counties Served
        </h3>
        <p className="text-sm text-gray-600">
          Digital Champion Grant distribution footprint
        </p>
      </div>

      {/* County List */}
      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {counties.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No county data available
          </div>
        ) : (
          counties.map((county) => (
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
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-hti-navy">{totalDevices}</div>
            <div className="text-xs text-gray-600">Total Devices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-hti-teal">{counties.length}</div>
            <div className="text-xs text-gray-600">Counties</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-hti-red">
              {counties.length > 0 ? Math.round(totalDevices / counties.length) : 0}
            </div>
            <div className="text-xs text-gray-600">Avg/County</div>
          </div>
        </div>
      </div>
    </div>
  );
}
