"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "card" | "table";
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
    lines = 1
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-surface-alt rounded";

    if (variant === "text") {
        return (
            <div className={cn("space-y-2", className)}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            baseClasses,
                            i === lines - 1 ? "w-3/4" : "w-full",
                            "h-4"
                        )}
                        style={{ width }}
                    />
                ))}
            </div>
        );
    }

    if (variant === "circular") {
        return (
            <div
                className={cn(baseClasses, "rounded-full", className)}
                style={{ width: width || height || 40, height: height || width || 40 }}
            />
        );
    }

    if (variant === "card") {
        return (
            <div className={cn("space-y-4 p-6", className)}>
                <div className={cn(baseClasses, "h-6 w-3/4")} />
                <div className={cn(baseClasses, "h-4 w-full")} />
                <div className={cn(baseClasses, "h-4 w-5/6")} />
                <div className={cn(baseClasses, "h-32 w-full")} />
            </div>
        );
    }

    if (variant === "table") {
        return (
            <div className={cn("space-y-3", className)}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className={cn(baseClasses, "h-12 flex-1")} />
                        <div className={cn(baseClasses, "h-12 w-32")} />
                        <div className={cn(baseClasses, "h-12 w-24")} />
                        <div className={cn(baseClasses, "h-12 w-20")} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseClasses, className)}
            style={{ width, height }}
        />
    );
}

// Pre-built skeleton components
export function CardSkeleton() {
    return <Skeleton variant="card" className="rounded-xl border border-default" />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 pb-3 border-b border-default">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-12 w-20" />
                </div>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-4">
                <Skeleton className="h-20 flex-1" />
                <Skeleton className="h-20 flex-1" />
            </div>
        </div>
    );
}
