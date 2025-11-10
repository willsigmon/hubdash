"use client";
import clsx from "clsx";
import React from "react";

type GradientVariant = "accent" | "navy" | "emerald" | "neutral" | "warning" | "white";

interface GradientHeadingProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    variant?: GradientVariant;
}

const variantMap: Record<GradientVariant, string> = {
    accent: "from-accent to-accent-alt",
    navy: "from-hti-navy to-hti-navy-light",
    emerald: "from-[#34D399] to-[#10B981]",
    neutral: "from-text-secondary to-text-primary",
    warning: "from-hti-amber to-hti-yellow",
    white: "from-white to-white/90",
};

export default function GradientHeading({
    children,
    as: Tag = "h2",
    className,
    variant = "accent",
}: GradientHeadingProps) {
    // For white variant, don't use text-transparent (it's already white)
    const isWhiteVariant = variant === "white";

    return (
        <Tag
            className={clsx(
                "font-bold tracking-tight inline-block",
                isWhiteVariant
                    ? "text-white"
                    : clsx("bg-gradient-to-r text-transparent bg-clip-text", variantMap[variant]),
                className
            )}
        >
            {children}
        </Tag>
    );
}
