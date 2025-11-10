"use client";

import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

interface ConfettiProps {
    trigger: boolean;
    options?: {
        particleCount?: number;
        spread?: number;
        origin?: { x: number; y: number };
        colors?: string[];
    };
}

export function Confetti({ trigger, options }: ConfettiProps) {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (trigger && !hasTriggered.current) {
            hasTriggered.current = true;

            const defaults = {
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#E67E50", "#F19E3E", "#F5BB2D", "#F9D71C", "#1B365D"],
            };

            confetti({
                ...defaults,
                ...options,
            });

            // Reset after animation
            setTimeout(() => {
                hasTriggered.current = false;
            }, 3000);
        }
    }, [trigger, options]);

    return null;
}

// Pre-configured confetti effects
export function celebrateMilestone(milestone: string) {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#E67E50", "#F19E3E", "#F5BB2D", "#F9D71C"],
    });
}

export function celebrateGoal() {
    // Multiple bursts
    confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#E67E50", "#F5BB2D"],
    });
    confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#F19E3E", "#F9D71C"],
    });
}

export function celebrateSuccess() {
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#34D399"],
    });
}
