"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    side?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}

export function Tooltip({ content, children, side = "top", delay = 200, className }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            updatePosition();
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const gap = 8;

        let top = 0;
        let left = 0;

        switch (side) {
            case "top":
                top = triggerRect.top - tooltipRect.height - gap;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case "bottom":
                top = triggerRect.bottom + gap;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case "left":
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left - tooltipRect.width - gap;
                break;
            case "right":
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + gap;
                break;
        }

        // Keep tooltip within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = gap;
        if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width - gap;
        }
        if (top < 0) top = gap;
        if (top + tooltipRect.height > viewportHeight) {
            top = viewportHeight - tooltipRect.height - gap;
        }

        setPosition({ top, left });
    };

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    }, [isVisible]);

    const childWithRef = React.cloneElement(children as React.ReactElement<any>, {
        ref: (node: HTMLElement | null) => {
            if (node) triggerRef.current = node;
            const childRef = (children as any).ref;
            if (typeof childRef === "function") {
                childRef(node);
            } else if (childRef && typeof childRef === "object") {
                childRef.current = node;
            }
        },
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
    });

    return (
        <>
            {childWithRef}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={cn(
                        "fixed z-50 px-3 py-2 text-sm text-primary bg-app-alt border border-default rounded-lg shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-200",
                        className
                    )}
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                    role="tooltip"
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={cn(
                            "absolute w-2 h-2 bg-app-alt border border-default",
                            side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45 border-t-0 border-l-0",
                            side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2 rotate-45 border-b-0 border-r-0",
                            side === "left" && "right-[-4px] top-1/2 -translate-y-1/2 rotate-45 border-l-0 border-b-0",
                            side === "right" && "left-[-4px] top-1/2 -translate-y-1/2 rotate-45 border-r-0 border-t-0"
                        )}
                    />
                </div>
            )}
        </>
    );
}

// Rich tooltip with title and description
export function RichTooltip({
    title,
    description,
    children,
    ...props
}: TooltipProps & { title: string; description?: string }) {
    return (
        <Tooltip
            {...props}
            content={
                <div className="max-w-xs">
                    <div className="font-semibold mb-1">{title}</div>
                    {description && <div className="text-xs text-secondary">{description}</div>}
                </div>
            }
        >
            {children}
        </Tooltip>
    );
}
