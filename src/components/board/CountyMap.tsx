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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 bg-gradient-to-br from-hti-navy/5 to-hti-teal/5 border-b border-hti-teal/20">
        <h3 className="text-2xl font-bold text-hti-navy mb-2">
          📍 {counties.length} Counties Served
        </h3>
        <p className="text-sm text-gray-600">
          Digital Champion Grant distribution footprint across North Carolina
        </p>
      </div>

      {/* County List with Progress Bars */}
      <div className="space-y-1 mb-0 max-h-80 overflow-y-auto">
        {counties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No county data available
          </div>
        ) : (
          counties.map((county, idx) => {
            const maxDevices = counties[0].devices;
            const percentage = (county.devices / maxDevices) * 100;
            return (
              <div
                key={county.name}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-hti-teal/5 hover:to-transparent transition-all border-b border-gray-100 last:border-b-0 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl font-bold text-hti-navy w-6">#{idx + 1}</span>
                    <span className="font-semibold text-gray-900 truncate">{county.name} County</span>
                    <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      statusColors[county.status]
                    }`}>
                      {statusLabels[county.status]}
                    </span>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-hti-teal">{county.devices}</div>
                    <div className="text-xs text-gray-500">devices</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      county.status === 'high' ? 'bg-gradient-to-r from-hti-red to-orange-400' :
                      county.status === 'moderate' ? 'bg-gradient-to-r from-hti-teal to-hti-teal-light' :
                      'bg-gradient-to-r from-hti-navy to-hti-navy/70'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats with Pizzazz */}
      <div className="grid grid-cols-3 gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-navy mb-1 group-hover:scale-110 transition-transform">
            {totalDevices}
          </div>
          <div className="text-sm font-medium text-gray-600">Total Devices</div>
          <div className="text-xs text-gray-500 mt-1">across NC</div>
        </div>
        <div className="text-center group border-l border-r border-gray-300">
          <div className="text-4xl font-bold text-hti-teal mb-1 group-hover:scale-110 transition-transform">
            {counties.length}
          </div>
          <div className="text-sm font-medium text-gray-600">Counties</div>
          <div className="text-xs text-gray-500 mt-1">in program</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-red mb-1 group-hover:scale-110 transition-transform">
            {counties.length > 0 ? Math.round(totalDevices / counties.length) : 0}
          </div>
          <div className="text-sm font-medium text-gray-600">Avg/County</div>
          <div className="text-xs text-gray-500 mt-1">distribution</div>
        </div>
      </div>
    </div>
  );
}
