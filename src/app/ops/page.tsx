import Link from "next/link";
import DevicePipeline from "@/components/ops/DevicePipeline";
import QuickStats from "@/components/ops/QuickStats";
import DonationRequests from "@/components/ops/DonationRequests";
import InventoryOverview from "@/components/ops/InventoryOverview";
import ActivityFeed from "@/components/ops/ActivityFeed";
import PageHero from "@/components/layout/PageHero";
import PageSectionHeading from "@/components/layout/PageSectionHeading";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/55 via-white to-hti-sand/45">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <PageHero
        theme="ops"
        title="Operations HUB"
        subtitle="Mission control for device workflows and real-time coordination"
        icon={<span role="img" aria-label="lightning">⚡</span>}
        maxWidth="wide"
        actions={(
          <>
            <div className="glass-card glass-card--subtle shadow-glass px-5 py-4 border border-hti-orange/45 min-w-[220px]">
              <div className="glass-card__glow bg-gradient-to-br from-hti-orange/30 to-hti-yellow/20" />
              <div className="relative space-y-1">
                <div className="text-[11px] uppercase tracking-[0.2em] text-hti-yellow/90 font-semibold">System Status</div>
                <div className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-hti-yellow/80 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hti-yellow" />
                  </span>
                  All Systems Operational
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
              aria-label="Return to HUBDash home page"
            >
              ← Back to HUB
            </Link>
          </>
        )}
      />

      {/* Main Content */}
      <main id="main-content" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" role="main">
        {/* Quick Stats Section */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Key Metrics"
            subtitle="Real-time operational KPIs and performance indicators"
            icon={<span role="img" aria-label="lightning">⚡</span>}
            size="md"
          />
          <QuickStats />
        </section>

        {/* Device Pipeline Section */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Device Pipeline"
            subtitle="Live snapshot of every laptop moving through HTI's refurbishment journey"
            icon={<span role="img" aria-label="chart">📊</span>}
            size="md"
          />
          <DevicePipeline />
        </section>

        {/* Two Column Layout - Donation Requests & Activity Feed */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Donation Requests */}
          <section className="h-full">
            <DonationRequests />
          </section>

          {/* Activity Feed */}
          <section className="h-full">
            <ActivityFeed />
          </section>
        </div>

        {/* Inventory Overview Section */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Device Inventory"
            subtitle="Complete searchable inventory with real-time status tracking"
            icon={<span role="img" aria-label="disk">💾</span>}
            size="md"
          />
          <InventoryOverview />
        </section>
      </main>
    </div>
  );
}
