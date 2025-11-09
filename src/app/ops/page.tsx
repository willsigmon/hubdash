import ActivityFeed from "@/components/ops/ActivityFeed";
import DevicePipelineFlow from "@/components/ops/DevicePipelineFlow";
import DonationRequests from "@/components/ops/DonationRequests";
import EquipmentInventory from "@/components/ops/EquipmentInventory";
import QuickStats from "@/components/ops/QuickStats";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SectionErrorBoundary from "@/components/shared/SectionErrorBoundary";
import Link from "next/link";

const commandSignals = [
  { label: "Devices in pipeline", value: "128", status: "processing" as const },
  { label: "QA queue", value: "14", status: "attention" as const },
  { label: "Deployments today", value: "36", status: "healthy" as const },
];

export default function OpsPage() {
  return (
    <div className="theme-dim min-h-screen bg-app text-white">
      {/* Header */}
      <header className="relative border-b border-default/60 bg-gradient-to-r from-hti-navy via-[#11162a] to-[#0c1324] shadow">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-1/3 h-60 w-60 rounded-full bg-hti-orange/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-hti-gold/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Ops mode • live sync
            </div>
            <h1 className="flex items-center gap-3 text-4xl font-bold text-white sm:text-5xl">
              ⚡ Operations HUB
            </h1>
            <p className="max-w-xl text-base font-medium text-white/70">
              Mission control for device intake, refurb, QA, and deployment. Everything the ops team
              needs without leaving one tab.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-success/40 bg-success/10 px-5 py-3 text-left text-success">
              <div className="text-xs font-semibold uppercase tracking-[0.25em]">System status</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                All systems operational
              </div>
            </div>
            <Link
              href="/"
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              ← Back to HUB
            </Link>
          </div>
        </div>

        <div className="relative border-t border-default/40 bg-white/5">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Command signals
            </span>
            <div className="flex flex-wrap gap-3">
              {commandSignals.map((signal) => (
                <div
                  key={signal.label}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold shadow-inner ${
                    signal.status === "healthy"
                      ? "border-success/40 bg-success/10 text-success"
                      : signal.status === "processing"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-warning/40 bg-warning/10 text-warning"
                  }`}
                >
                  <p>{signal.value}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                    {signal.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <SectionErrorBoundary section="Key Metrics">
            <section className="rounded-3xl border border-default/60 bg-surface/90 p-6 shadow-lg backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                  <span role="img" aria-hidden="true">
                    ⚡
                  </span>
                  Key Metrics
                </h2>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  Live
                </span>
              </div>
              <QuickStats />
            </section>
          </SectionErrorBoundary>

          <SectionErrorBoundary section="Device Pipeline Workflow">
            <section className="rounded-3xl border border-default/60 bg-surface/90 p-6 shadow-lg backdrop-blur">
              <DevicePipelineFlow />
            </section>
          </SectionErrorBoundary>

          <div className="grid gap-8 lg:grid-cols-2">
            <SectionErrorBoundary section="Donation Requests">
              <section className="rounded-3xl border border-default/60 bg-surface/90 p-6 shadow-lg backdrop-blur">
                <DonationRequests />
              </section>
            </SectionErrorBoundary>

            <SectionErrorBoundary section="Activity Feed">
              <section className="rounded-3xl border border-default/60 bg-surface/90 p-6 shadow-lg backdrop-blur">
                <ActivityFeed />
              </section>
            </SectionErrorBoundary>
          </div>

          <SectionErrorBoundary section="Equipment Inventory">
            <section className="rounded-3xl border border-default/60 bg-surface/90 p-6 shadow-lg backdrop-blur">
              <EquipmentInventory />
            </section>
          </SectionErrorBoundary>
        </ErrorBoundary>
      </main>
    </div>
  );
}
