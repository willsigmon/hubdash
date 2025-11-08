"use client";

import clsx from "clsx";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tone?: "light" | "dark";
    elevation?: "md" | "lg";
}

export default function GlassCard({
    tone = "light",
    elevation = "md",
    className,
    children,
    ...rest
}: GlassCardProps) {
    return (
        <div
            className={clsx(
                tone === "dark" ? "glass-on-dark" : "glass",
                elevation === "lg" ? "elevation-lg" : "elevation-md",
                "rounded-2xl border no-black-border",
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
}
