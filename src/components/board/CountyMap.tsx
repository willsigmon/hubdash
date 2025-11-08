"use client";

import { useEffect, useState } from "react";
import { CountyDetailModal } from "./CountyDetailModal";

interface County {
  name: string;
  devices: number;
  status: "active" | "high" | "moderate";
}

const statusColors = {
  high: "bg-hti-ember text-white",
  moderate: "bg-hti-sunset text-white",
  active: "bg-hti-plum text-white",
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
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-hti-fig/10">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-hti-plum mb-2">
            Counties Served
          </h3>
          <p className="text-sm text-hti-stone font-medium">
            Digital Champion Grant distribution footprint
          </p>
        </div>
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-hti-sand rounded-lg h-12" />
          ))}
        </div>
      </div>
    );
  }

  const handleFilterByCounty = (countyName: string) => {
    // This would integrate with a global filter context
    console.log('Filtering all dashboards by:', countyName);
    // TODO: Implement global county filter
  };

  return (
    <>
      {selectedCounty && (
        <CountyDetailModal
          countyName={selectedCounty.name}
          totalDevices={selectedCounty.devices}
          onClose={() => setSelectedCounty(null)}
          onFilterByCounty={handleFilterByCounty}
        />
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-hti-fig/10">
        <div className="p-8 bg-gradient-to-br from-hti-plum/8 to-hti-ember/8 border-b border-hti-fig/10">
          <h3 className="text-2xl font-bold text-hti-plum mb-2">
            📍 {counties.length} Counties Served
          </h3>
          <p className="text-sm text-hti-stone font-medium">
            Digital Champion Grant distribution footprint across North Carolina
          </p>
          <p className="text-xs text-hti-stone/60 mt-2 italic">
            Click county for details • Double-click to filter all data
          </p>
        </div>

      {/* County List with Progress Bars */}
      <div className="space-y-1 mb-0 max-h-80 overflow-y-auto">
        {counties.length === 0 ? (
          <div className="text-center py-12 text-hti-stone/60">
            No county data available
          </div>
        ) : (
          counties.map((county, idx) => {
            const maxDevices = counties[0].devices;
            const percentage = (county.devices / maxDevices) * 100;
            const isHovered = hoveredCounty === county.name;

            return (
              <div
                key={county.name}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-hti-sand/60 hover:to-hti-soleil/10 transition-all border-b border-hti-fig/10 last:border-b-0 group cursor-pointer relative"
                onClick={() => setSelectedCounty(county)}
                onDoubleClick={() => handleFilterByCounty(county.name)}
                onMouseEnter={() => setHoveredCounty(county.name)}
                onMouseLeave={() => setHoveredCounty(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 px-4 py-2 bg-hti-midnight text-white text-sm rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="font-semibold">Click for details • Double-click to filter</div>
                    <div className="text-xs text-white/60 mt-1">
                      {county.devices} devices across {county.name} County
                    </div>
                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-hti-midnight" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl font-bold text-hti-plum w-6">#{idx + 1}</span>
                    <span className="font-bold text-hti-plum truncate">{county.name} County</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      statusColors[county.status]
                    }`}>
                      {statusLabels[county.status]}
                    </span>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-hti-ember">{county.devices}</div>
                    <div className="text-xs text-hti-stone font-medium">devices</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-hti-sand rounded-full h-3 overflow-hidden border border-hti-fig/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      county.status === 'high' ? 'bg-gradient-to-r from-hti-ember to-hti-gold' :
                      county.status === 'moderate' ? 'bg-gradient-to-r from-hti-sunset to-hti-gold' :
                      'bg-gradient-to-r from-hti-plum to-hti-fig'
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
      <div className="grid grid-cols-3 gap-6 p-8 bg-hti-sand border-t border-hti-fig/10">
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-plum mb-1 group-hover:scale-110 transition-transform">
            {totalDevices}
          </div>
          <div className="text-sm font-bold text-hti-plum">Total Devices</div>
          <div className="text-xs text-hti-stone mt-1 font-medium">across NC</div>
        </div>
        <div className="text-center group border-l border-r border-hti-fig/10">
          <div className="text-4xl font-bold text-hti-sunset mb-1 group-hover:scale-110 transition-transform">
            {counties.length}
          </div>
          <div className="text-sm font-bold text-hti-plum">Counties</div>
          <div className="text-xs text-hti-stone mt-1 font-medium">in program</div>
        </div>
        <div className="text-center group">
          <div className="text-4xl font-bold text-hti-ember mb-1 group-hover:scale-110 transition-transform">
            {counties.length > 0 ? Math.round(totalDevices / counties.length) : 0}
          </div>
          <div className="text-sm font-bold text-hti-plum">Avg/County</div>
          <div className="text-xs text-hti-stone mt-1 font-medium">distribution</div>
        </div>
      </div>
      </div>
    </>
  );
}
