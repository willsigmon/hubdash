"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', collected: 150, distributed: 120 },
  { month: 'Feb', collected: 280, distributed: 210 },
  { month: 'Mar', collected: 420, distributed: 340 },
  { month: 'Apr', collected: 580, distributed: 480 },
  { month: 'May', collected: 750, distributed: 630 },
  { month: 'Jun', collected: 920, distributed: 780 },
  { month: 'Jul', collected: 1100, distributed: 950 },
  { month: 'Aug', collected: 1300, distributed: 1120 },
  { month: 'Sep', collected: 1520, distributed: 1310 },
  { month: 'Oct', collected: 1750, distributed: 1520 },
  { month: 'Nov', collected: 2000, distributed: 1740 },
  { month: 'Dec', collected: 2280, distributed: 1980 },
];

export default function TrendChart() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Devices Over Time
        </h3>
        <p className="text-sm text-gray-600">
          Cumulative laptops collected and Chromebooks distributed
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
          />
          <Line
            type="monotone"
            dataKey="collected"
            stroke="#1e3a5f"
            strokeWidth={3}
            name="Laptops Collected"
            dot={{ fill: '#1e3a5f', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="distributed"
            stroke="#4a9b9f"
            strokeWidth={3}
            name="Chromebooks Distributed"
            dot={{ fill: '#4a9b9f', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-hti-navy/5 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-1">Avg/Month</div>
          <div className="text-lg font-bold text-hti-navy">190 devices</div>
        </div>
        <div className="p-3 bg-hti-teal/5 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-lg font-bold text-hti-teal">87%</div>
        </div>
      </div>
    </div>
  );
}
