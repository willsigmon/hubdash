'use client';

interface GoalProgressCardProps {
  title: string;
  current: number;
  goal: number;
  label: string;
}

export function GoalProgressCard({ title, current, goal, label }: GoalProgressCardProps) {
  const percentage = Math.min((current / goal) * 100, 100);

  let statusClass = 'status-on-track';
  let statusText = 'On Track';

  if (percentage >= 100) {
    statusClass = 'status-achieved';
    statusText = 'Achieved';
  } else if (percentage >= 75) {
    statusClass = 'status-on-track';
    statusText = 'On Track';
  } else if (percentage >= 50) {
    statusClass = 'status-at-risk';
    statusText = 'At Risk';
  } else {
    statusClass = 'status-behind';
    statusText = 'Behind';
  }

  return (
    <div className="metric-card">
      <h4 className="text-sm font-semibold text-gray-600 mb-3">{title}</h4>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="metric-value">{current.toLocaleString()}</span>
        <span className="text-gray-500">/ {goal.toLocaleString()}</span>
      </div>

      <div className="progress-bar mb-3">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={statusClass}>{statusText}</span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {percentage.toFixed(1)}% complete • {Math.max(goal - current, 0)} remaining
      </div>
    </div>
  );
}
