/**
 * Card Component
 * 
 * Reusable card wrapper with HTI brand styling.
 * Provides consistent padding, borders, shadows, and hover effects.
 * 
 * @example
 * ```tsx
 * <Card variant="standard" gradient="from-hti-plum to-hti-fig">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */

import React from 'react';

export interface CardProps {
  /** Content to render inside the card */
  children: React.ReactNode;
  /** Card variant - determines styling theme */
  variant?: 'standard' | 'featured' | 'glass' | 'minimal';
  /** Gradient for accent bar (top/bottom) */
  gradient?: string;
  /** Whether to show top accent bar */
  showTopAccent?: boolean;
  /** Whether to show bottom accent bar */
  showBottomAccent?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Whether card should have hover effect */
  hoverable?: boolean;
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  variant = 'standard',
  gradient = 'from-hti-plum to-hti-fig',
  showTopAccent = true,
  showBottomAccent = false,
  className = '',
  hoverable = true,
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    standard: `
      rounded-xl bg-white shadow-lg
      ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
      transition-all duration-300
      border border-hti-fig/10
    `,
    featured: `
      rounded-2xl bg-white shadow-2xl
      ${hoverable ? 'hover:shadow-3xl' : ''}
      transition-all duration-300
      border border-hti-ember/25
    `,
    glass: `
      rounded-xl bg-white/5 backdrop-blur-sm
      border border-hti-yellow/50 shadow-xl
      ${hoverable ? 'hover:border-hti-red/70 hover:scale-105' : ''}
      transition-all duration-300
    `,
    minimal: `
      rounded-xl bg-white
      border border-hti-fig/20
      ${hoverable ? 'hover:shadow-lg' : ''}
      transition-shadow
    `,
  };

  const accentHeight = variant === 'featured' ? 'h-3' : 'h-2';
  const bottomAccentHeight = variant === 'featured' ? 'h-1' : 'h-1';

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {showTopAccent && (
        <div className={`${accentHeight} bg-gradient-to-r ${gradient}`} />
      )}
      
      <div className={`relative ${paddingClasses[padding]}`}>
        {/* Background gradient overlay for hover effect */}
        {variant !== 'minimal' && (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-${variant === 'featured' ? '5' : '3'} ${hoverable ? 'group-hover:opacity-10' : ''} transition-opacity`} />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
      
      {showBottomAccent && (
        <div className={`${bottomAccentHeight} bg-gradient-to-r ${gradient}`} />
      )}
    </div>
  );
}
