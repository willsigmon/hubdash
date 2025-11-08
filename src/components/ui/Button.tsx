/**
 * Button Component
 * 
 * Reusable button with HTI brand styling and multiple variants.
 * Includes proper focus states and accessibility features.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Generate Report
 * </Button>
 * 
 * <Button variant="secondary" size="sm">
 *   Cancel
 * </Button>
 * 
 * <Button variant="destructive" icon={<Trash />}>
 *   Delete
 * </Button>
 * ```
 */

import React from 'react';

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display (optional) */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Custom className */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-hti-ember to-hti-gold
      text-white font-semibold
      shadow-lg hover:shadow-xl
      hover:-translate-y-0.5
      focus-visible:outline-2 focus-visible:outline-hti-ember focus-visible:outline-offset-2
    `,
    secondary: `
      border border-hti-fig/35
      text-hti-plum font-semibold
      hover:bg-hti-sand
      focus-visible:outline-2 focus-visible:outline-hti-plum focus-visible:outline-offset-2
    `,
    destructive: `
      bg-hti-ember text-white font-semibold
      hover:bg-hti-sunset
      focus-visible:outline-2 focus-visible:outline-hti-ember focus-visible:outline-offset-2
    `,
    ghost: `
      text-hti-plum font-semibold
      hover:bg-hti-sand/60
      focus-visible:outline-2 focus-visible:outline-hti-plum focus-visible:outline-offset-2
    `,
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
