"use client";
import clsx from "clsx";
import React from "react";

interface GradientHeadingProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    from?: string;
    to?: string;
}

export default function GradientHeading({
    children,
    as: Tag = "h2",
    className,
    from = "hti-ember",
    to = "hti-gold",
}: GradientHeadingProps) {
    return (
        <Tag
            className={clsx(
                "font-bold tracking-tight bg-gradient-to-r inline-block text-transparent bg-clip-text",
                `from-${from} to-${to}`,
                className
            )}
        >
            {children}
        </Tag>
    );
}
