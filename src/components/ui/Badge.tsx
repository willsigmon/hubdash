/**
 * Badge Component
 * 
 * Reusable badge for status indicators, labels, and tags.
 * Supports multiple variants with proper contrast and accessibility.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Ready to Ship</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="error">Urgent</Badge>
 * <Badge variant="gradient" gradient="from-hti-ember to-hti-gold">80% Complete</Badge>
 * ```
 */

import React from 'react';

export interface BadgeProps {
  /** Content to display in the badge */
  children: React.ReactNode;
  /** Badge variant - determines color scheme */
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gradient';
  /** Gradient colors (used when variant is 'gradient') */
  gradient?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

export default function Badge({
  children,
  variant = 'info',
  gradient = 'from-hti-ember to-hti-gold',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-hti-yellow/30 text-hti-yellow border border-hti-yellow/60',
    error: 'bg-hti-red/30 text-hti-red border border-hti-red/60',
    info: 'bg-hti-plum/20 text-hti-plum border border-hti-plum/30',
    gradient: `bg-gradient-to-br ${gradient} text-white shadow-lg`,
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full font-bold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
