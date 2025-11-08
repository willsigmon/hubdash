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
    gradientClass?: string; // e.g., "from-hti-plum to-hti-fig"
}

export default function MetricCard({
    label,
    value,
    icon,
    suffix,
    description,
    highlight = false,
    gradientClass = "from-hti-plum to-hti-fig",
}: MetricCardProps) {
    return (
        <GlassCard
            className={clsx(
                "relative overflow-hidden transition group",
                highlight ? "p-8" : "p-6",
                "focus-within:ring-4 focus-within:ring-hti-soleil/60"
            )}
            elevation={highlight ? "lg" : "md"}
            tone="light"
        >
            <div
                aria-hidden
                className={clsx(
                    "absolute inset-0 opacity-10 group-hover:opacity-15 transition bg-gradient-to-br",
                    gradientClass
                )}
            />
            <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {icon && <span className="text-3xl md:text-4xl" aria-hidden>{icon}</span>}
                        <span className="font-bold text-sm tracking-wide uppercase text-hti-plum">
                            {label}
                        </span>
                    </div>
                    {highlight && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-hti-ember to-hti-gold text-white shadow">
                            Live
                        </span>
                    )}
                </div>
                <div className="flex items-end gap-1">
                    <div className={clsx("font-bold", highlight ? "text-5xl md:text-6xl" : "text-4xl", "text-hti-plum")}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                    {suffix && <div className={clsx("font-bold", highlight ? "text-2xl" : "text-xl", "text-hti-ember")}>{suffix}</div>}
                </div>
                {description && (
                    <p className="text-xs md:text-sm text-hti-stone font-medium leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </GlassCard>
    );
}
