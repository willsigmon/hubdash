"use client";

import { useEffect, useState } from "react";

interface County {
  name: string;
  devices: number;
  status: "active" | "high" | "moderate";
}

const statusColors = {
  high: "glass-chip glass-chip--orange text-xs",
  moderate: "glass-chip glass-chip--yellow text-xs",
  active: "glass-chip glass-chip--navy text-xs",
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
      <div className="glass-card glass-card--subtle shadow-glass p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-glass-bright mb-2">
            Counties Served
          </h3>
          <p className="text-sm text-glass-muted font-medium">
            Digital Champion Grant distribution footprint
          </p>
        </div>
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card glass-card--subtle h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
      <div className="p-8 glass-divider">
        <h3 className="text-2xl font-bold text-glass-bright mb-2">
          📍 {counties.length} Counties Served
        </h3>
        <p className="text-sm text-glass-muted font-medium">
          Digital Champion Grant distribution footprint across North Carolina
        </p>
      </div>

      {/* County List with Progress Bars */}
      <div className="space-y-1 mb-0 max-h-80 overflow-y-auto">
        {counties.length === 0 ? (
          <div className="text-center py-12 text-glass-muted">
            No county data available
          </div>
        ) : (
          counties.map((county, idx) => {
            const maxDevices = counties[0].devices;
            const percentage = (county.devices / maxDevices) * 100;
            return (
              <div
                key={county.name}
                className="px-6 py-4 transition-all border-b border-white/10 last:border-b-0 group hover:bg-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl font-bold text-glass-bright w-6">#{idx + 1}</span>
                    <span className="font-bold text-glass-bright truncate">{county.name} County</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      statusColors[county.status]
                    }`}>
                      {statusLabels[county.status]}
                    </span>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-glass-bright">{county.devices}</div>
                    <div className="text-xs text-glass-muted font-medium">devices</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="glass-track">
                  <div
                    className={`glass-track__fill transition-all duration-300 ${
                      county.status === 'high' ? 'bg-gradient-to-r from-hti-orange to-hti-yellow-orange' :
                      county.status === 'moderate' ? 'bg-gradient-to-r from-hti-orange-yellow to-hti-yellow-orange' :
                      'bg-gradient-to-r from-hti-navy to-hti-navy/80'
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
      <div className="grid grid-cols-3 gap-6 p-8 glass-divider">
        <div className="text-center group">
          <div className="text-4xl font-bold text-glass-bright mb-1 group-hover:scale-110 transition-transform">
            {totalDevices}
          </div>
          <div className="text-sm font-bold text-glass-muted">Total Devices</div>
          <div className="text-xs text-glass-muted mt-1 font-medium">across NC</div>
        </div>
        <div className="text-center group border-l border-r border-hti-navy/10">
          <div className="text-4xl font-bold text-glass-bright mb-1 group-hover:scale-110 transition-transform">
            {counties.length}
          </div>
          <div className="text-sm font-bold text-glass-muted">Counties</div>
          <div className="text-xs text-glass-muted mt-1 font-medium">in program</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-bold text-glass-bright mb-1 group-hover:scale-110 transition-transform">
            {counties.length > 0 ? Math.round(totalDevices / counties.length) : 0}
          </div>
          <div className="text-sm font-bold text-glass-muted">Avg/County</div>
          <div className="text-xs text-glass-muted mt-1 font-medium">distribution</div>
        </div>
      </div>
    </div>
  );
}
