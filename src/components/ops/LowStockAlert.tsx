"use client";

import { AlertTriangle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    minThreshold: number;
    category: string;
    type: string;
}

export default function LowStockAlert({ onItemClick }: { onItemClick?: (itemId: string) => void }) {
    const [dismissed, setDismissed] = useState(false);

    const { data: inventoryData } = useQuery<InventoryItem[]>({
        queryKey: ["inventory"],
        queryFn: async () => {
            const res = await fetch("/api/inventory");
            if (!res.ok) throw new Error("Failed to fetch inventory");
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        },
    });

    const inventory: InventoryItem[] = inventoryData || [];
    const lowStockItems = inventory.filter((item) => item.quantity < item.minThreshold);

    if (dismissed || lowStockItems.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-right duration-300">
            <div className="rounded-xl border-2 border-warning/60 bg-gradient-to-br from-warning/20 via-warning/10 to-surface shadow-2xl backdrop-blur-sm">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-warning/30 flex items-center justify-center border-2 border-warning/50 animate-pulse">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <h4 className="font-bold text-warning text-sm mb-0.5">Low Stock Alert</h4>
                                <p className="text-xs text-primary font-medium">
                                    {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} need{lowStockItems.length === 1 ? "s" : ""} restocking
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="p-1 hover:bg-warning/20 rounded transition-colors"
                            aria-label="Dismiss alert"
                        >
                            <X className="w-4 h-4 text-warning" />
                        </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {lowStockItems.slice(0, 3).map((item) => {
                            const stockPercent = Math.round((item.quantity / item.minThreshold) * 100);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onItemClick?.(item.id)}
                                    className="w-full text-left px-3 py-2 bg-surface/80 rounded-lg border border-warning/30 hover:border-warning hover:bg-surface transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-primary group-hover:text-warning transition-colors truncate">
                                            {item.name}
                                        </span>
                                        <span className="text-xs font-bold text-warning ml-2 flex-shrink-0">
                                            {item.quantity}/{item.minThreshold}
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-warning transition-all"
                                            style={{ width: `${Math.min(stockPercent, 100)}%` }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {lowStockItems.length > 3 && (
                        <p className="text-[10px] text-muted mt-2 text-center">
                            +{lowStockItems.length - 3} more
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
