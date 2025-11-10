"use client";
import clsx from "clsx";
import React from "react";

type GradientVariant = "accent" | "navy" | "emerald" | "neutral" | "warning" | "white";

interface GradientHeadingProps {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    variant?: GradientVariant;
    style?: React.CSSProperties;
}

const gradientMap: Record<GradientVariant, string> = {
    accent: "linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))",
    navy: "linear-gradient(90deg, #1B365D, #2A4A7C)",
    emerald: "linear-gradient(90deg, #34D399, #10B981)",
    neutral: "linear-gradient(90deg, var(--color-text-secondary), var(--color-text-primary))",
    warning: "linear-gradient(90deg, var(--hti-amber), var(--hti-gold))",
    white: "linear-gradient(90deg, #ffffff, #f5f5f5)",
};

export default function GradientHeading({
    children,
    as: Tag = "h2",
    className,
    variant = "accent",
    style,
}: GradientHeadingProps) {
    // For white variant, don't use text-transparent (it's already white)
    const isWhiteVariant = variant === "white";
    const gradientStyle = isWhiteVariant ? style : { backgroundImage: gradientMap[variant], ...style };

    return (
        <Tag
            className={clsx(
                "font-bold tracking-tight inline-block",
                isWhiteVariant
                    ? "text-white"
                    : "text-transparent bg-clip-text",
                className
            )}
            style={gradientStyle}
        >
            {children}
        </Tag>
    );
}
