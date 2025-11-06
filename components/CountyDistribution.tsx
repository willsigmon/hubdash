'use client';

export function CountyDistribution() {
  // Sample data - would come from Knack API
  const countyData = [
    { county: 'Wake', devices: 350, training: 25 },
    { county: 'Durham', devices: 280, training: 18 },
    { county: 'Halifax', devices: 120, training: 12 },
    { county: 'Vance', devices: 95, training: 10 },
    { county: 'Wilson', devices: 85, training: 8 },
    { county: 'Franklin', devices: 75, training: 7 },
    { county: 'Granville', devices: 70, training: 6 },
    { county: 'Edgecombe', devices: 65, training: 5 },
    { county: 'Nash', devices: 60, training: 5 },
    { county: 'Warren', devices: 55, training: 4 },
    { county: 'Person', devices: 50, training: 4 },
    { county: 'Martin', devices: 45, training: 3 },
    { county: 'Hertford', devices: 40, training: 3 },
    { county: 'Northampton', devices: 35, training: 2 },
    { county: 'Greene', devices: 30, training: 2 },
  ];

  const maxDevices = Math.max(...countyData.map(c => c.devices));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Device distribution and training hours across HTI's 15-county service area
        </p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-hti-blue rounded"></div>
            <span>Devices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-hti-navy rounded"></div>
            <span>Training Hours</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {countyData.map((county) => (
          <div key={county.county} className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-hti-navy">{county.county} County</span>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{county.devices} devices</span>
                <span>{county.training}h training</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full bg-hti-blue rounded-full transition-all duration-500"
                    style={{ width: `${(county.devices / maxDevices) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-20">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full bg-hti-navy rounded-full transition-all duration-500"
                    style={{ width: `${(county.training / 25) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-hti-navy">
            {countyData.reduce((sum, c) => sum + c.devices, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Devices</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-hti-navy">
            {countyData.reduce((sum, c) => sum + c.training, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Training Hours</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">15/15</div>
          <div className="text-sm text-gray-600">Counties Covered</div>
        </div>
      </div>
    </div>
  );
}
