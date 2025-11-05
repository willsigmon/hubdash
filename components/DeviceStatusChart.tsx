'use client';

export function DeviceStatusChart() {
  // Sample data - would come from Knack API
  const deviceData = [
    { status: 'Acquired', count: 1500, color: 'bg-blue-500' },
    { status: 'Converted', count: 1000, color: 'bg-green-500' },
    { status: 'Ready', count: 280, color: 'bg-yellow-500' },
    { status: 'Presented', count: 620, color: 'bg-purple-500' },
    { status: 'Discarded', count: 100, color: 'bg-red-500' },
  ];

  const total = deviceData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="space-y-4">
          {deviceData.map((item) => (
            <div key={item.status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item.status}</span>
                <span className="text-gray-600">{item.count.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {deviceData.map((item) => (
            <div key={item.status} className={`${item.color} bg-opacity-10 rounded-lg p-4`}>
              <div className={`text-3xl font-bold ${item.color.replace('bg-', 'text-')}`}>
                {item.count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-700 mt-1">{item.status}</div>
              <div className="text-xs text-gray-500 mt-1">
                {((item.count / total) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-hti-navy">{total.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Devices Tracked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {((1000 / 2500) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate vs. Goal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">620</div>
            <div className="text-sm text-gray-600">Delivered to Community</div>
          </div>
        </div>
      </div>
    </div>
  );
}
