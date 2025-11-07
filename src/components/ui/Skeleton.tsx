"use client";

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
  lines?: number;
}

/**
 * Enhanced Skeleton Component with Framer Motion
 * Provides smooth loading animations with multiple variants
 */
export default function Skeleton({
  className = '',
  variant = 'default',
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-gradient-to-r from-hti-sand/60 to-hti-sand/40';

  const variantClasses = {
    default: 'rounded',
    card: 'rounded-xl',
    text: 'rounded h-4',
    circle: 'rounded-full',
    button: 'rounded-lg h-10',
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="relative overflow-hidden">
            <motion.div
              className={`${baseClasses} ${variantClasses.text} w-full`}
              style={{ width: i === lines - 1 ? '60%' : '100%' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} w-full h-full`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>
    </div>
  );
}

// Specialized skeleton components
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-hti-teal/20 p-6">
      <div className="space-y-4">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" lines={3} />
        <div className="flex gap-2">
          <Skeleton variant="button" className="w-20" />
          <Skeleton variant="button" className="w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-hti-teal/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-hti-teal/10">
        <Skeleton variant="text" className="h-5 w-48" />
      </div>

      {/* Table rows */}
      <div className="divide-y divide-hti-teal/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-10 h-10" />
                <div className="space-y-1">
                  <Skeleton variant="text" className="h-4 w-32" />
                  <Skeleton variant="text" className="h-3 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton variant="button" className="w-16 h-8" />
                <Skeleton variant="button" className="w-12 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-hti-teal/20 p-6">
      <div className="space-y-4">
        <Skeleton variant="text" className="h-5 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-8 w-24" />
            <Skeleton variant="text" className="h-4 w-32" />
          </div>
        </div>
        <Skeleton variant="button" className="w-full h-3 rounded-full" />
      </div>
    </div>
  );
}
