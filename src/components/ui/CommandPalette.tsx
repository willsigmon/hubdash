"use client";

import { Command } from "cmdk";
import { Search, Laptop, Package, Users, FileText, Settings, Home, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";
import { useKeyboardShortcuts, SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    keywords?: string[];
    action: () => void;
    group?: string;
}

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const commands: CommandItem[] = [
        // Navigation
        {
            id: "home",
            label: "Go to HUB",
            description: "Return to main dashboard",
            icon: <Home className="w-4 h-4" />,
            keywords: ["home", "hub", "main"],
            action: () => {
                router.push("/");
                setOpen(false);
            },
            group: "Navigation",
        },
        {
            id: "ops",
            label: "Operations HUB",
            description: "Device pipeline and operations",
            icon: <Laptop className="w-4 h-4" />,
            keywords: ["ops", "operations", "devices", "pipeline"],
            action: () => {
                router.push("/ops");
                setOpen(false);
            },
            group: "Navigation",
        },
        {
            id: "board",
            label: "Board Dashboard",
            description: "Executive metrics and insights",
            icon: <FileText className="w-4 h-4" />,
            keywords: ["board", "executive", "metrics"],
            action: () => {
                router.push("/board");
                setOpen(false);
            },
            group: "Navigation",
        },
        {
            id: "marketing",
            label: "Marketing Hub",
            description: "Partnership applications",
            icon: <Users className="w-4 h-4" />,
            keywords: ["marketing", "partnerships", "applications"],
            action: () => {
                router.push("/marketing");
                setOpen(false);
            },
            group: "Navigation",
        },
        {
            id: "reports",
            label: "Grant Reports",
            description: "NCDIT compliance reporting",
            icon: <FileText className="w-4 h-4" />,
            keywords: ["reports", "grant", "compliance"],
            action: () => {
                router.push("/reports");
                setOpen(false);
            },
            group: "Navigation",
        },
        // Quick Actions
        {
            id: "devices-unassigned",
            label: "View Unassigned Devices",
            description: "Devices ready for technician assignment",
            icon: <Package className="w-4 h-4" />,
            keywords: ["devices", "unassigned", "ready"],
            action: () => {
                router.push("/ops/devices/unassigned");
                setOpen(false);
            },
            group: "Quick Actions",
        },
        {
            id: "devices-assigned",
            label: "View Assigned Devices",
            description: "Devices in process with technicians",
            icon: <Laptop className="w-4 h-4" />,
            keywords: ["devices", "assigned", "in process"],
            action: () => {
                router.push("/ops/devices/assigned");
                setOpen(false);
            },
            group: "Quick Actions",
        },
        {
            id: "donations",
            label: "View Donation Requests",
            description: "Pending donation pickups",
            icon: <Package className="w-4 h-4" />,
            keywords: ["donations", "pickups", "requests"],
            action: () => {
                router.push("/ops");
                setOpen(false);
            },
            group: "Quick Actions",
        },
    ];

    // Register Cmd+K shortcut
    useKeyboardShortcuts([
        {
            ...SHORTCUTS.SEARCH,
            handler: () => setOpen(true),
        },
        {
            key: "Escape",
            handler: () => setOpen(false),
        },
    ]);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
                    onClick={() => setOpen(false)}
                >
                    <Command className="w-full max-w-2xl bg-surface rounded-2xl border-2 border-default shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-default">
                            <Search className="w-5 h-5 text-muted" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-primary placeholder:text-muted text-lg"
                                autoFocus
                            />
                            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-secondary bg-surface-alt border border-default rounded">
                                ESC
                            </kbd>
                        </div>
                        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                            <Command.Empty className="py-8 text-center text-secondary">
                                No results found.
                            </Command.Empty>
                            {Object.entries(
                                commands.reduce((acc, cmd) => {
                                    if (!acc[cmd.group || "Other"]) acc[cmd.group || "Other"] = [];
                                    acc[cmd.group || "Other"].push(cmd);
                                    return acc;
                                }, {} as Record<string, CommandItem[]>)
                            ).map(([group, items]) => (
                                <div key={group} className="mb-4">
                                    <Command.Group heading={group} className="px-2 py-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
                                        {items.map((cmd) => (
                                            <Command.Item
                                                key={cmd.id}
                                                value={`${cmd.label} ${cmd.description} ${cmd.keywords?.join(" ")}`}
                                                onSelect={cmd.action}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-accent aria-selected:text-on-accent transition-colors group"
                                            >
                                                <div className="text-muted group-aria-selected:text-on-accent">
                                                    {cmd.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-primary group-aria-selected:text-on-accent">
                                                        {cmd.label}
                                                    </div>
                                                    {cmd.description && (
                                                        <div className="text-xs text-secondary group-aria-selected:text-on-accent/80">
                                                            {cmd.description}
                                                        </div>
                                                    )}
                                                </div>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                </div>
                            ))}
                        </Command.List>
                        <div className="px-4 py-2 border-t border-default flex items-center justify-between text-xs text-secondary">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface-alt border border-default rounded">↑↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-surface-alt border border-default rounded">↵</kbd>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-surface-alt border border-default rounded">⌘K</kbd>
                                <span>Open</span>
                            </div>
                        </div>
                    </Command>
                </div>
            )}
        </>
    );
}
