"use client";

import { useRef, useState, ReactNode, useEffect } from 'react';
import { useDrag } from 'react-use-gesture';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableContainerProps {
  children: ReactNode[];
  className?: string;
  showIndicators?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
}

/**
 * Swipeable Container with Gesture Support
 * Allows users to swipe between different content sections on mobile
 */
export default function SwipeableContainer({
  children,
  className = '',
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true,
}: SwipeableContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, children.length, isDragging]);

  // Gesture handling
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity, cancel }) => {
      const triggerThreshold = 50;
      const velocityThreshold = 0.3;

      if (!active && Math.abs(mx) > triggerThreshold && Math.abs(velocity) > velocityThreshold) {
        const direction = xDir < 0 ? 1 : -1;
        const newIndex = Math.max(0, Math.min(children.length - 1, currentIndex + direction));
        setCurrentIndex(newIndex);
      }

      setIsDragging(active);
    },
    {
      filterTaps: true,
      axis: 'x',
      bounds: { left: -100, right: 100, top: 0, bottom: 0 },
    }
  );

  const navigateTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(children.length - 1, index)));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % children.length);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
        {...bind()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {showNavigation && children.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-hti-teal/20 flex items-center justify-center text-hti-navy hover:bg-white hover:shadow-xl transition-all z-10"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-hti-teal/20 flex items-center justify-center text-hti-navy hover:bg-white hover:shadow-xl transition-all z-10"
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                  ? 'bg-hti-teal w-6'
                  : 'bg-hti-teal/30 hover:bg-hti-teal/50'
                }`}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Pull-to-Refresh Component
 * Allows users to pull down to refresh content
 */
export function PullToRefresh({
  children,
  onRefresh,
  className = ''
}: {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);

    if (distance > 0) {
      setPullDistance(distance);
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  const pullProgress = Math.min(pullDistance / 80, 1);

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        style={{
          y: pullDistance > 0 ? pullDistance - 40 : -40,
        }}
      >
        <motion.div
          animate={{ rotate: pullProgress * 360 }}
          className="w-8 h-8 bg-hti-teal rounded-full flex items-center justify-center text-white shadow-lg"
        >
          {isRefreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <ChevronLeft
              className="w-4 h-4"
              style={{ transform: `rotate(${pullProgress * 180}deg)` }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          y: pullDistance > 0 ? pullDistance : 0,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Mobile-Optimized Form Input
 * Enhanced input with better mobile UX
 */
export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  [key: string]: any;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full px-4 py-3 text-base border border-hti-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal focus:border-transparent transition-all ${className}`}
      style={{
        // Prevent zoom on iOS
        fontSize: '16px',
        // Better touch targets
        minHeight: '44px',
      }}
      {...props}
    />
  );
}
