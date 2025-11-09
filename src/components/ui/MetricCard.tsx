"use client";
import GlassCard from "@/components/ui/GlassCard";
import clsx from "clsx";

interface MetricCardProps {
    label: string;
    value: number | string;
    icon?: string;
    suffix?: string;
    description?: string;
    highlight?: boolean;
    /**
     * Optional override for the background gradient overlay.
     * Provide Tailwind gradient utility classes. Defaults to semantic accent gradient.
     */
    gradientClass?: string;
    /**
     * Optional inline progress (0-100). When provided, shows a compact progress bar
     * integrated within the card. Ideal for featured metrics (e.g., grant progress).
     */
    progress?: number;
    /**
     * Optional label shown on the right side of the progress bar (e.g., "64%" )
     */
    progressLabel?: string;
}

export default function MetricCard({
    label,
    value,
    icon,
    suffix,
    description,
    highlight = false,
    gradientClass = "accent-gradient",
    progress,
    progressLabel,
}: MetricCardProps) {
    return (
        <GlassCard
            className={clsx(
                "relative overflow-hidden transition group",
                highlight ? "p-6" : "p-4",
                "focus-ring"
            )}
            elevation={highlight ? "lg" : "md"}
        >
            <div
                aria-hidden
                className={clsx(
                    "absolute inset-0 opacity-10 group-hover:opacity-15 transition",
                    gradientClass
                )}
            />
            <div className="relative z-10 space-y-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {icon && <span className="text-3xl md:text-4xl" aria-hidden>{icon}</span>}
                        <span className="font-black text-sm md:text-base tracking-wide uppercase text-secondary">
                            {label}
                        </span>
                    </div>
                    {highlight && (
                        <span className="px-3 py-1 rounded-full text-xs font-black accent-gradient text-white shadow-lg">
                            Live
                        </span>
                    )}
                </div>
                <div className="flex items-end gap-2">
                    <div className={clsx("font-black", highlight ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl", "text-primary")}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                    {suffix && <div className={clsx("font-black", highlight ? "text-2xl md:text-3xl" : "text-xl md:text-2xl", "text-accent")}>{suffix}</div>}
                </div>
                {typeof progress === "number" && progress >= 0 && progress <= 100 && (
                    <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-primary">Progress</span>
                            <span className="text-xs font-bold text-accent">{progressLabel ?? `${progress}%`}</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-alt rounded-full overflow-hidden shadow-inner border border-default">
                            <div
                                className={clsx("h-full rounded-full transition-all duration-500 ease-out", gradientClass)}
                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                            />
                        </div>
                    </div>
                )}
                {description && (
                    <p className="text-sm md:text-base text-secondary font-semibold leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </GlassCard>
    );
}
