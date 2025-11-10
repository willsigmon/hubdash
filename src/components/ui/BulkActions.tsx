"use client";

import { Check, X, Trash2, Download, Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BulkAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: (selectedIds: string[]) => void | Promise<void>;
    variant?: "default" | "danger" | "success";
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
}

interface BulkActionsProps {
    selectedIds: string[];
    actions: BulkAction[];
    onClearSelection: () => void;
    totalCount?: number;
    className?: string;
}

export function BulkActions({
    selectedIds,
    actions,
    onClearSelection,
    totalCount,
    className,
}: BulkActionsProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [confirmingAction, setConfirmingAction] = useState<string | null>(null);

    if (selectedIds.length === 0) return null;

    const handleAction = async (action: BulkAction) => {
        if (action.requiresConfirmation && confirmingAction !== action.id) {
            setConfirmingAction(action.id);
            return;
        }

        try {
            await action.action(selectedIds);
            onClearSelection();
            setConfirmingAction(null);
            setShowMenu(false);
        } catch (error) {
            console.error("Bulk action failed:", error);
            setConfirmingAction(null);
        }
    };

    return (
        <div
            className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface border-2 border-accent rounded-2xl px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-5 duration-300",
                className
            )}
        >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-soft-accent rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-bold text-accent">
                    {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"} selected
                </span>
            </div>

            <div className="h-6 w-px bg-default" />

            <div className="flex items-center gap-2">
                {actions.slice(0, 3).map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                            confirmingAction === action.id
                                ? "bg-danger text-on-danger"
                                : action.variant === "danger"
                                    ? "bg-soft-danger text-danger hover:bg-danger hover:text-on-danger"
                                    : action.variant === "success"
                                        ? "bg-soft-success text-success hover:bg-success hover:text-on-success"
                                        : "bg-soft-accent text-accent hover:bg-accent hover:text-on-accent"
                        )}
                    >
                        {confirmingAction === action.id ? (
                            <>
                                <X className="w-4 h-4" />
                                Cancel
                            </>
                        ) : (
                            <>
                                {action.icon}
                                {action.label}
                            </>
                        )}
                    </button>
                ))}

                {actions.length > 3 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-surface-alt text-primary hover:bg-surface border border-default transition-all"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                            More
                        </button>

                        {showMenu && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-surface border-2 border-default rounded-xl shadow-xl overflow-hidden">
                                {actions.slice(3).map((action) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-primary hover:bg-surface-alt transition-colors"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={onClearSelection}
                className="ml-2 p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt transition-colors"
                aria-label="Clear selection"
            >
                <X className="w-4 h-4" />
            </button>

            {confirmingAction && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="bg-surface border-2 border-default rounded-xl p-4 max-w-sm">
                        <p className="font-semibold text-primary mb-2">Confirm Action</p>
                        <p className="text-sm text-secondary mb-4">
                            {actions.find((a) => a.id === confirmingAction)?.confirmationMessage ||
                                `Are you sure you want to perform this action on ${selectedIds.length} items?`}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const action = actions.find((a) => a.id === confirmingAction);
                                    if (action) handleAction(action);
                                }}
                                className="flex-1 px-4 py-2 bg-danger text-on-danger rounded-lg font-semibold hover:bg-danger/90 transition-colors"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmingAction(null)}
                                className="flex-1 px-4 py-2 bg-surface-alt text-primary rounded-lg font-semibold hover:bg-surface transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
