"use client";

import { DeviceManagementTable } from "@/components/ops/DeviceManagementTable";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

export default function ConvertedDevicesPage() {
    const { data } = useQuery({
        queryKey: queryKeys.devicesPaginated(1, 50, "Ready to Ship"),
        queryFn: async () => {
            const res = await fetch(`/api/devices?page=1&limit=50&status=Ready to Ship`);
            if (!res.ok) throw new Error("Failed to fetch devices");
            return res.json();
        },
    });

    return (
        <div className="min-h-screen bg-app">
            <header className="bg-surface border-b border-default text-primary shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Converted/Ready Devices</h1>
                            <p className="text-lg font-medium text-secondary">
                                Devices ready to be presented ({data?.data?.length || 0} devices)
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
                <DeviceManagementTable />
            </main>
        </div>
    );
}
