"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

interface RealtimeOptions {
    interval?: number; // Polling interval in ms (default: 30000 = 30 seconds)
    enabled?: boolean;
    onUpdate?: () => void;
}

export function useRealtimeUpdates(options: RealtimeOptions = {}) {
    const { interval = 30000, enabled = true, onUpdate } = options;
    const queryClient = useQueryClient();
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (!enabled) return;

        const refreshData = async () => {
            try {
                // Invalidate and refetch key queries
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: queryKeys.devices }),
                    queryClient.invalidateQueries({ queryKey: queryKeys.donations }),
                    queryClient.invalidateQueries({ queryKey: queryKeys.partners }),
                    queryClient.invalidateQueries({ queryKey: queryKeys.metrics }),
                ]);
                onUpdate?.();
            } catch (error) {
                console.error("Realtime update failed:", error);
            }
        };

        // Initial refresh
        refreshData();

        // Set up polling
        intervalRef.current = setInterval(refreshData, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, queryClient, onUpdate]);

    return {
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.devices });
            queryClient.invalidateQueries({ queryKey: queryKeys.donations });
            queryClient.invalidateQueries({ queryKey: queryKeys.partners });
            queryClient.invalidateQueries({ queryKey: queryKeys.metrics });
        },
    };
}
