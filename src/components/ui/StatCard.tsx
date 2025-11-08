/**
 * StatCard Component
 * 
 * Specialized card for displaying metrics and statistics.
 * Used in both Impact Metrics (board) and Quick Stats (ops).
 * 
 * @example
 * ```tsx
 * <StatCard
 *   icon="💻"
 *   value={3500}
 *   suffix="+"
 *   label="Total Laptops"
 *   description="Overall collection since inception"
 *   gradient="from-hti-plum to-hti-fig"
 * />
 * ```
 */

import React from 'react';

export interface StatCardProps {
  /** Icon emoji or React component */
  icon: string | React.ReactNode;
  /** Numeric value to display */
  value: number | string;
  /** Suffix to append to value (e.g., "+", "tons", "%") */
  suffix?: string;
  /** Main label for the stat */
  label: string;
  /** Optional description text */
  description?: string;
  /** Gradient for accent bars */
  gradient: string;
  /** Optional badge text (e.g., "Live", "80% Complete") */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'gradient' | 'simple';
  /** Theme variant */
  theme?: 'light' | 'dark';
  /** Whether to animate the value */
  animated?: boolean;
  /** Trend indicator */
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  /** Custom className */
  className?: string;
}

export default function StatCard({
  icon,
  value,
  suffix = '',
  label,
  description,
  gradient,
  badge,
  badgeVariant = 'simple',
  theme = 'light',
  animated = false,
  trend,
  className = '',
}: StatCardProps) {
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-white' : 'text-hti-plum';
  const secondaryText = isDark ? 'text-hti-yellow' : 'text-hti-stone';
  const accentText = isDark ? 'text-hti-yellow' : 'text-hti-ember';

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl
        ${isDark 
          ? 'bg-white/5 backdrop-blur-sm border border-hti-yellow/50 shadow-xl hover:border-hti-red/70 hover:scale-105'
          : 'bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 border border-hti-fig/10'
        }
        transition-all duration-300
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-${isDark ? '5' : '3'} group-hover:opacity-${isDark ? '15' : '8'} transition-opacity`} />

      {/* Top accent bar */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="relative p-6 space-y-4">
        {/* Header with icon and badge */}
        <div className="flex items-start justify-between">
          <div className={`text-5xl ${isDark ? 'group-hover:scale-110 transition-transform origin-left' : ''}`}>
            {typeof icon === 'string' ? icon : icon}
          </div>
          
          {badge && (
            <span 
              className={`
                px-2 py-1 rounded-full text-xs font-bold shadow-sm
                ${badgeVariant === 'gradient'
                  ? `bg-gradient-to-br ${gradient} text-white`
                  : isDark
                    ? 'bg-hti-yellow/30 text-hti-yellow border border-hti-yellow/60'
                    : `bg-gradient-to-br ${gradient} text-white`
                }
              `}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Value section */}
        <div>
          <div className={`text-4xl font-bold ${textColor} ${isDark && 'group-hover:text-hti-yellow transition-colors'} ${animated ? 'animate-counter' : ''}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
            <span className={`text-2xl font-bold ${accentText} ml-1`}>
              {suffix}
            </span>
          </div>
          <h4 className={`text-sm font-bold ${textColor} mt-1`}>
            {label}
          </h4>
        </div>

        {/* Description or trend */}
        {description && (
          <div className={`text-xs ${secondaryText} leading-relaxed font-medium`}>
            {description}
          </div>
        )}

        {trend && (
          <div 
            className={`
              text-xs font-bold inline-block px-3 py-1.5 rounded
              ${isDark ? 'bg-hti-yellow/20 border border-hti-yellow/60' : `bg-${gradient.split('-')[1]}/20`}
              ${isDark ? 'text-hti-yellow' : accentText}
            `}
          >
            {trend.direction === 'up' && '↑ '}
            {trend.direction === 'down' && '↓ '}
            {trend.text}
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
    </div>
  );
}
