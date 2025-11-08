"use client";
import clsx from "clsx";
import React from "react";

type GradientVariant = "accent" | "sunrise" | "emerald" | "neutral" | "plum" | "warning";

interface GradientHeadingProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    variant?: GradientVariant;
}

const variantMap: Record<GradientVariant, string> = {
    accent: "from-accent to-accent-alt",
    sunrise: "from-[#FF7E5F] to-[#FEB47B]",
    emerald: "from-[#34D399] to-[#10B981]",
    neutral: "from-text-secondary to-text-primary",
    plum: "from-[#5B2A86] to-[#8A4FFF]",
    warning: "from-[#F59E0B] to-[#FCD34D]",
};

export default function GradientHeading({
    children,
    as: Tag = "h2",
    className,
    variant = "accent",
}: GradientHeadingProps) {
    return (
        <Tag
            className={clsx(
                "font-bold tracking-tight bg-gradient-to-r inline-block text-transparent bg-clip-text",
                variantMap[variant],
                className
            )}
        >
            {children}
        </Tag>
    );
}
