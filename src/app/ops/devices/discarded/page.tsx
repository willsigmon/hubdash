"use client";

import { DeviceManagementTable } from "@/components/ops/DeviceManagementTable";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

export default function DiscardedDevicesPage() {
    // Check if discarded status exists in Knack - if not, show empty state
    const { data } = useQuery({
        queryKey: queryKeys.devicesPaginated(1, 50, "Discarded"),
        queryFn: async () => {
            // Try to fetch discarded devices - if status doesn't exist, return empty
            const res = await fetch(`/api/devices?page=1&limit=50&status=Discarded`);
            if (!res.ok) {
                // If status doesn't exist, return empty array
                return { data: [], total: 0 };
            }
            const result = await res.json();
            // If no data, return empty
            if (!result.data || result.data.length === 0) {
                return { data: [], total: 0 };
            }
            return result;
        },
    });

    return (
        <div className="min-h-screen bg-app">
            <header className="bg-surface border-b border-default text-primary shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Discarded Devices</h1>
                            <p className="text-lg font-medium text-secondary">
                                Devices marked for eCycling ({data?.data?.length || 0} devices)
                            </p>
                        </div>
                        <Link
                            href="/ops"
                            className="px-6 py-3 accent-gradient text-on-accent rounded-lg transition-all duration-200 text-sm font-semibold shadow hover:-translate-y-0.5"
                        >
                            ← Back to Ops
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {data?.data && data.data.length > 0 ? (
                    <DeviceManagementTable defaultStatusFilter="Discarded" />
                ) : (
                    <div className="text-center py-16 bg-surface rounded-2xl border-2 border-default">
                        <p className="text-xl font-bold text-primary mb-2">No Discarded Devices</p>
                        <p className="text-secondary">This status category is not currently used in Knack. Devices marked for eCycling would appear here.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
