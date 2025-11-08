"use client";

import clsx from "clsx";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "translucent" | "solid" | "ghost";
    elevation?: "sm" | "md" | "lg";
    interactive?: boolean;
}

export default function GlassCard({
    variant = "translucent",
    elevation = "md",
    interactive = false,
    className,
    children,
    ...rest
}: GlassCardProps) {
    const base = "rounded-2xl border transition-colors duration-200";
    const variantClass =
        variant === "solid"
            ? "bg-surface-alt border-default"
            : variant === "ghost"
                ? "bg-transparent border-transparent"
                : "backdrop-blur-md bg-surface/70 border-default"; // translucent
    const elevationClass =
        elevation === "lg"
            ? "shadow-lg"
            : elevation === "sm"
                ? "shadow-sm"
                : "shadow-md";
    const interactiveClass = interactive
        ? "hover:border-strong hover:bg-surface-hover cursor-pointer"
        : "";

    return (
        <div
            className={clsx(base, variantClass, elevationClass, interactiveClass, className)}
            {...rest}
        >
            {children}
        </div>
    );
}
