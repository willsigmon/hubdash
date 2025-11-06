"use client";

import { useEffect, useState } from "react";

interface County {
  name: string;
  devices: number;
  status: "active" | "high" | "moderate";
}

const statusColors = {
  high: "bg-hti-red text-white",
  moderate: "bg-hti-orange text-white",
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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-hti-yellow/50">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-hti-navy mb-2">
            Counties Served
          </h3>
          <p className="text-sm text-gray-700 font-medium">
            Digital Champion Grant distribution footprint
          </p>
        </div>
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-hti-gray-light rounded-lg h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-hti-yellow/50">
      <div className="p-8 bg-gradient-to-br from-hti-navy/5 to-hti-red/5 border-b border-hti-yellow/50">
        <h3 className="text-2xl font-bold text-hti-navy mb-2">
          📍 {counties.length} Counties Served
        </h3>
        <p className="text-sm text-gray-700 font-medium">
          Digital Champion Grant distribution footprint across North Carolina
        </p>
      </div>

      {/* County List with Progress Bars */}
      <div className="space-y-1 mb-0 max-h-80 overflow-y-auto">
        {counties.length === 0 ? (
          <div className="text-center py-12 text-hti-gray/50">
            No county data available
          </div>
        ) : (
          counties.map((county, idx) => {
            const maxDevices = counties[0].devices;
            const percentage = (county.devices / maxDevices) * 100;
            return (
              <div
                key={county.name}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-hti-yellow/5 hover:to-hti-red/5 transition-all border-b border-hti-yellow/40 last:border-b-0 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl font-bold text-hti-navy w-6">#{idx + 1}</span>
                    <span className="font-bold text-hti-navy truncate">{county.name} County</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      statusColors[county.status]
                    }`}>
                      {statusLabels[county.status]}
                    </span>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-hti-red">{county.devices}</div>
                    <div className="text-xs text-gray-700 font-medium">devices</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-hti-gray-light rounded-full h-3 overflow-hidden border border-hti-yellow/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      county.status === 'high' ? 'bg-gradient-to-r from-hti-red to-hti-orange' :
                      county.status === 'moderate' ? 'bg-gradient-to-r from-hti-orange to-hti-yellow' :
                      'bg-gradient-to-r from-hti-navy to-hti-gray'
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
      <div className="grid grid-cols-3 gap-6 p-8 bg-hti-gray-light border-t border-hti-yellow/50">
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-navy mb-1 group-hover:scale-110 transition-transform">
            {totalDevices}
          </div>
          <div className="text-sm font-bold text-hti-navy">Total Devices</div>
          <div className="text-xs text-gray-700 mt-1 font-medium">across NC</div>
        </div>
        <div className="text-center group border-l border-r border-hti-yellow/50">
          <div className="text-4xl font-bold text-hti-orange mb-1 group-hover:scale-110 transition-transform">
            {counties.length}
          </div>
          <div className="text-sm font-bold text-hti-navy">Counties</div>
          <div className="text-xs text-gray-700 mt-1 font-medium">in program</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-red mb-1 group-hover:scale-110 transition-transform">
            {counties.length > 0 ? Math.round(totalDevices / counties.length) : 0}
          </div>
          <div className="text-sm font-bold text-hti-navy">Avg/County</div>
          <div className="text-xs text-gray-700 mt-1 font-medium">distribution</div>
        </div>
      </div>
    </div>
  );
}
