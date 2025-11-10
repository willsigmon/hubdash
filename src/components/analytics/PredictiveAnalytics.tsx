"use client";

import { TrendingUp, Calendar, Target, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

interface Prediction {
    id: string;
    label: string;
    value: string | number;
    trend: "up" | "down" | "stable";
    timeframe: string;
    icon: React.ReactNode;
    color: string;
}

export function PredictiveAnalytics() {
    const { data: metrics } = useQuery({
        queryKey: queryKeys.metrics,
        queryFn: async () => {
            const res = await fetch("/api/metrics");
            if (!res.ok) throw new Error("Failed to fetch metrics");
            return res.json();
        },
    });

    const { data: devices } = useQuery({
        queryKey: queryKeys.devicesPaginated(1, 1000),
        queryFn: async () => {
            const res = await fetch("/api/devices?limit=1000");
            if (!res.ok) throw new Error("Failed to fetch devices");
            return res.json();
        },
    });

    // Calculate predictions
    const predictions: Prediction[] = [];

    if (metrics && devices) {
        const totalDevices = devices.data?.length || 0;
        const grantGoal = 1000; // Example grant goal
        const currentProgress = metrics.grantLaptopsPresented || 0;
        const completionPercentage = (currentProgress / grantGoal) * 100;

        // Calculate average devices per month (last 3 months)
        const avgDevicesPerMonth = totalDevices / 3; // Simplified
        const devicesNeeded = grantGoal - currentProgress;
        const monthsToGoal = avgDevicesPerMonth > 0 ? Math.ceil(devicesNeeded / avgDevicesPerMonth) : null;

        // Pipeline bottleneck detection
        const statusCounts: Record<string, number> = {};
        devices.data?.forEach((d: any) => {
            const status = d.status || "Unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const qaQueue = statusCounts["QA Testing"] || 0;
        const avgQATime = 3.2; // days (example)
        const bottleneck = qaQueue > 10 ? "QA Testing" : null;

        // Expected donations next month
        const recentDonations = 12; // Would come from donations API
        const expectedDonations = Math.round(recentDonations * 1.1); // 10% growth

        if (monthsToGoal) {
            predictions.push({
                id: "grant-goal",
                label: "Grant Goal Completion",
                value: `${monthsToGoal} months`,
                trend: completionPercentage > 85 ? "up" : "stable",
                timeframe: `At current rate, grant goal reached in ${monthsToGoal} months`,
                icon: <Target className="w-5 h-5" />,
                color: completionPercentage > 85 ? "text-success" : "text-accent",
            });
        }

        if (bottleneck) {
            predictions.push({
                id: "bottleneck",
                label: "Pipeline Bottleneck",
                value: bottleneck,
                trend: "down",
                timeframe: `Average ${avgQATime} days in ${bottleneck}`,
                icon: <AlertCircle className="w-5 h-5" />,
                color: "text-highlight",
            });
        }

        predictions.push({
            id: "expected-donations",
            label: "Expected Donations",
            value: `${expectedDonations}-${expectedDonations + 6}`,
            trend: "up",
            timeframe: "Next month forecast",
            icon: <Calendar className="w-5 h-5" />,
            color: "text-accent",
        });

        predictions.push({
            id: "completion-rate",
            label: "Grant Progress",
            value: `${completionPercentage.toFixed(1)}%`,
            trend: completionPercentage > 85 ? "up" : "stable",
            timeframe: `${currentProgress} of ${grantGoal} devices`,
            icon: <TrendingUp className="w-5 h-5" />,
            color: completionPercentage > 85 ? "text-success" : "text-accent",
        });
    }

    if (predictions.length === 0) {
        return null;
    }

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-accent to-accent/60 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-on-accent" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-primary">Predictive Analytics</h3>
                    <p className="text-sm text-secondary">Forecasts and insights</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((prediction, index) => (
                    <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-surface-alt rounded-xl border border-default hover:border-accent/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={prediction.color}>{prediction.icon}</div>
                                <span className="text-sm font-semibold text-secondary">{prediction.label}</span>
                            </div>
                            {prediction.trend === "up" && (
                                <span className="text-xs font-bold text-success">↑</span>
                            )}
                            {prediction.trend === "down" && (
                                <span className="text-xs font-bold text-highlight">↓</span>
                            )}
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${prediction.color}`}>
                            {prediction.value}
                        </div>
                        <p className="text-xs text-muted">{prediction.timeframe}</p>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}

