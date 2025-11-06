'use client';

export function TrainingMetrics() {
  // Sample data - would come from Knack API
  const monthlyData = [
    { month: 'Jan', hours: 8, participants: 45 },
    { month: 'Feb', hours: 12, participants: 68 },
    { month: 'Mar', hours: 10, participants: 52 },
    { month: 'Apr', hours: 15, participants: 89 },
    { month: 'May', hours: 14, participants: 76 },
    { month: 'Jun', hours: 16, participants: 94 },
  ];

  const totalHours = monthlyData.reduce((sum, m) => sum + m.hours, 0);
  const totalParticipants = monthlyData.reduce((sum, m) => sum + m.participants, 0);
  const avgParticipantsPerSession = (totalParticipants / monthlyData.length).toFixed(1);

  const maxHours = Math.max(...monthlyData.map(m => m.hours));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-value">{totalHours}</div>
          <div className="metric-label">Total Training Hours</div>
          <div className="text-xs text-green-600 mt-2">
            {((totalHours / 156) * 100).toFixed(1)}% of 2026 goal
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{totalParticipants}</div>
          <div className="metric-label">Total Participants</div>
          <div className="text-xs text-gray-600 mt-2">
            Across 45 sessions
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{avgParticipantsPerSession}</div>
          <div className="metric-label">Avg Participants/Session</div>
          <div className="text-xs text-gray-600 mt-2">
            Steady engagement
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <h4 className="font-semibold text-hti-navy mb-4">Monthly Breakdown (2025)</h4>
      <div className="space-y-4">
        {monthlyData.map((month) => (
          <div key={month.month}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{month.month}</span>
              <span className="text-gray-600">
                {month.hours}h • {month.participants} participants
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-full bg-hti-blue rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${(month.hours / maxHours) * 100}%` }}
              >
                <span className="text-xs text-hti-navy font-medium">
                  {month.hours}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-hti-navy mb-3">Popular Training Topics</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { topic: 'Basic Computer Skills', sessions: 12 },
            { topic: 'Internet Safety', sessions: 10 },
            { topic: 'Email & Communication', sessions: 8 },
            { topic: 'Job Search Online', sessions: 7 },
            { topic: 'Healthcare Portals', sessions: 5 },
            { topic: 'Social Media Basics', sessions: 3 },
          ].map((item) => (
            <div
              key={item.topic}
              className="bg-hti-blue bg-opacity-10 border border-hti-blue rounded-full px-4 py-2 text-sm"
            >
              <span className="font-medium text-hti-navy">{item.topic}</span>
              <span className="text-gray-700 ml-2">({item.sessions})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
