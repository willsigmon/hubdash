'use client';

export function QuickStats() {
  // These would come from Knack API in production
  const stats = [
    { label: 'Total Devices', value: '1,500', change: '+125 this quarter', positive: true },
    { label: 'Ready for Distribution', value: '280', change: '12 pending', positive: true },
    { label: 'Training Sessions', value: '45', change: '+8 this month', positive: true },
    { label: 'Counties Active', value: '15', change: 'Full coverage', positive: true },
  ];

  return (
    <section>
      <h3 className="section-title">Quick Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="metric-card">
            <div className="metric-value">{stat.value}</div>
            <div className="metric-label">{stat.label}</div>
            <div className={`text-xs mt-2 ${stat.positive ? 'text-green-600' : 'text-gray-600'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
