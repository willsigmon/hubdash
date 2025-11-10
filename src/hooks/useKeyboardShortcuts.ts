"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    handler: (e: KeyboardEvent) => void;
    description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const matchesKey = e.key === shortcut.key || e.key.toLowerCase() === shortcut.key.toLowerCase();
                const matchesCtrl = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
                const matchesMeta = shortcut.meta ? (e.metaKey || e.ctrlKey) : true;
                const matchesShift = shortcut.shift ? e.shiftKey : !e.shiftKey;
                const matchesAlt = shortcut.alt ? e.altKey : !e.altKey;

                if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
                    e.preventDefault();
                    shortcut.handler(e);
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts]);
}

// Common shortcut combinations
export const SHORTCUTS = {
    SEARCH: { key: "k", meta: true, description: "Open search" },
    ESCAPE: { key: "Escape", description: "Close modal" },
    SAVE: { key: "s", meta: true, description: "Save" },
    NEW: { key: "n", meta: true, description: "New item" },
    DELETE: { key: "Delete", description: "Delete selected" },
    HELP: { key: "/", meta: true, description: "Show shortcuts" },
} as const;
