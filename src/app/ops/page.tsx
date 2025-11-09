"use client";

import DevicePipelineFlow from "@/components/ops/DevicePipelineFlow";
import DonationRequests from "@/components/ops/DonationRequests";
import EquipmentInventory from "@/components/ops/EquipmentInventory";
import QuickStats from "@/components/ops/QuickStats";
import LowStockAlert from "@/components/ops/LowStockAlert";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SectionErrorBoundary from "@/components/shared/SectionErrorBoundary";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OpsPage() {
  const [commandSignals, setCommandSignals] = useState([
    { label: "Devices in pipeline", value: "—", status: "processing" as const },
    { label: "QA queue", value: "—", status: "attention" as const },
    { label: "Deployments today", value: "—", status: "healthy" as const },
  ]);

  useEffect(() => {
    // Fetch real metrics for command signals
    Promise.all([
      fetch('/api/metrics').then(r => r.json()).catch(() => null),
      fetch('/api/devices?limit=1000').then(r => r.json()).catch(() => null),
    ]).then(([metrics, devices]) => {
      const deviceData = devices?.data || devices || [];
      const inPipeline = deviceData.filter((d: any) =>
        d.status && !['Distributed', 'Discarded'].includes(d.status)
      ).length;
      const qaQueue = deviceData.filter((d: any) =>
        d.status?.toLowerCase().includes('qa') || d.status?.toLowerCase().includes('testing')
      ).length;
      const deployments = metrics?.readyToShip || 0;

      setCommandSignals([
        { label: "Devices in pipeline", value: String(inPipeline), status: "processing" as const },
        { label: "QA queue", value: String(qaQueue), status: "attention" as const },
        { label: "Ready to ship", value: String(deployments), status: "healthy" as const },
      ]);
    });
  }, []);
  return (
    <div className="min-h-screen bg-app text-primary">
      {/* Header - Compact */}
      <header className="sticky top-0 z-40 border-b border-default bg-gradient-to-r from-surface via-surface-alt to-surface shadow-lg theme-dim:from-hti-navy theme-dim:via-hti-navy-dark theme-dim:to-hti-navy">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute -left-20 top-1/3 h-40 w-40 rounded-full bg-hti-orange/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-hti-gold/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-2xl">⚡</div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-primary theme-dim:text-white sm:text-3xl truncate">
                  Operations HUB
                </h1>
                <p className="text-xs text-secondary theme-dim:text-white/80 mt-0.5 hidden sm:block">
                  Mission control for device intake, refurb, QA, and deployment
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-xs font-semibold text-secondary theme-dim:text-white/90">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              {commandSignals.map((signal) => (
                <div
                  key={signal.label}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${signal.status === "healthy"
                    ? "border-success/50 bg-soft-success/50 text-success"
                    : signal.status === "processing"
                      ? "border-accent/50 bg-soft-accent/50 text-accent"
                      : "border-highlight/50 bg-soft-highlight/50 text-highlight"
                    }`}
                >
                  <span className="font-bold text-primary theme-dim:text-white">{signal.value}</span>
                  <span className="text-[10px] text-secondary theme-dim:text-white/70 ml-1.5 uppercase tracking-wide hidden xl:inline">
                    {signal.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="rounded-lg accent-gradient px-4 py-2 text-xs font-bold text-on-accent shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              ← HUB
            </Link>
          </div>
        </div>
      </header>

      {/* Low Stock Alert - Top Right */}
      <LowStockAlert />

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <ErrorBoundary>
          {/* Key Metrics - Compact */}
          <SectionErrorBoundary section="Key Metrics">
            <section className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">
                  Key Metrics
                </h2>
              </div>
              <QuickStats />
            </section>
          </SectionErrorBoundary>

          {/* Device Pipeline - Prominent */}
          <SectionErrorBoundary section="Device Pipeline Workflow">
            <section className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
              <DevicePipelineFlow />
            </section>
          </SectionErrorBoundary>

          {/* Donation Requests - Full Width */}
          <SectionErrorBoundary section="Donation Requests">
            <section className="rounded-2xl border border-default bg-surface shadow-lg">
              <DonationRequests />
            </section>
          </SectionErrorBoundary>

          {/* Equipment Inventory */}
          <SectionErrorBoundary section="Equipment Inventory">
            <section className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
              <EquipmentInventory />
            </section>
          </SectionErrorBoundary>
        </ErrorBoundary>
      </main>
    </div>
  );
}
