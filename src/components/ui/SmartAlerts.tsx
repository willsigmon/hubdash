"use client";

import { AlertCircle, Clock, CheckCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Alert {
    id: string;
    type: "warning" | "info" | "success" | "error";
    title: string;
    message: string;
    timestamp: Date;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function SmartAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const { data: devices } = useQuery({
        queryKey: queryKeys.devicesPaginated(1, 1000),
        queryFn: async () => {
            const res = await fetch("/api/devices?limit=1000");
            if (!res.ok) throw new Error("Failed to fetch devices");
            return res.json();
        },
        refetchInterval: 30000, // Check every 30 seconds
    });

    const { data: donations } = useQuery({
        queryKey: queryKeys.donations,
        queryFn: async () => {
            const res = await fetch("/api/donations");
            if (!res.ok) throw new Error("Failed to fetch donations");
            return res.json();
        },
        refetchInterval: 30000,
    });

    useEffect(() => {
        const newAlerts: Alert[] = [];

        // Check for devices stuck in QA
        if (devices?.data) {
            const qaDevices = devices.data.filter((d: any) => {
                if (d.status !== "QA Testing") return false;
                const receivedDate = d.received_date ? new Date(d.received_date) : null;
                if (!receivedDate) return false;
                const daysInQA = (Date.now() - receivedDate.getTime()) / (1000 * 60 * 60 * 24);
                return daysInQA > 7;
            });

            if (qaDevices.length > 0) {
                newAlerts.push({
                    id: "qa-stuck",
                    type: "warning",
                    title: `${qaDevices.length} Device(s) Stuck in QA`,
                    message: `Devices have been in QA Testing for more than 7 days`,
                    timestamp: new Date(),
                    action: {
                        label: "View Devices",
                        onClick: () => window.location.href = "/ops/devices/converted",
                    },
                });
            }
        }

        // Check for pending donation requests
        if (donations?.data) {
            const pendingDonations = donations.data.filter((d: any) => {
                if (d.status !== "pending") return false;
                const requestedDate = d.requested_date ? new Date(d.requested_date) : null;
                if (!requestedDate) return false;
                const daysPending = (Date.now() - requestedDate.getTime()) / (1000 * 60 * 60 * 24);
                return daysPending > 3;
            });

            if (pendingDonations.length > 0) {
                newAlerts.push({
                    id: "donations-pending",
                    type: "info",
                    title: `${pendingDonations.length} Donation Request(s) Pending`,
                    message: `Donation requests have been pending for more than 3 days`,
                    timestamp: new Date(),
                    action: {
                        label: "View Requests",
                        onClick: () => window.location.href = "/ops",
                    },
                });
            }
        }

        // Grant progress alert
        if (devices?.data) {
            const grantGoal = 1000;
            const currentProgress = 832; // Would come from metrics
            const completionPercentage = (currentProgress / grantGoal) * 100;

            if (completionPercentage >= 85 && completionPercentage < 100) {
                newAlerts.push({
                    id: "grant-progress",
                    type: "success",
                    title: "Grant Progress: 85%+",
                    message: `Ahead of schedule! ${currentProgress} of ${grantGoal} devices completed`,
                    timestamp: new Date(),
                });
            }
        }

        setAlerts(newAlerts);
    }, [devices, donations]);

    const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));

    if (visibleAlerts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
            <AnimatePresence>
                {visibleAlerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className={cn(
                            "p-4 rounded-xl border-2 shadow-xl backdrop-blur-sm",
                            alert.type === "warning" && "bg-soft-highlight border-highlight/50",
                            alert.type === "info" && "bg-soft-accent border-accent/50",
                            alert.type === "success" && "bg-soft-success border-success/50",
                            alert.type === "error" && "bg-soft-danger border-danger/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                alert.type === "warning" && "bg-highlight/20",
                                alert.type === "info" && "bg-accent/20",
                                alert.type === "success" && "bg-success/20",
                                alert.type === "error" && "bg-danger/20"
                            )}>
                                <AlertCircle className={cn(
                                    "w-5 h-5",
                                    alert.type === "warning" && "text-highlight",
                                    alert.type === "info" && "text-accent",
                                    alert.type === "success" && "text-success",
                                    alert.type === "error" && "text-danger"
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-primary mb-1">{alert.title}</h4>
                                <p className="text-sm text-secondary mb-2">{alert.message}</p>
                                {alert.action && (
                                    <button
                                        onClick={alert.action.onClick}
                                        className="text-xs font-semibold text-accent hover:underline"
                                    >
                                        {alert.action.label} →
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setDismissed(prev => new Set(prev).add(alert.id))}
                                className="p-1 hover:bg-black/10 rounded transition-colors"
                            >
                                <X className="w-4 h-4 text-secondary" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

