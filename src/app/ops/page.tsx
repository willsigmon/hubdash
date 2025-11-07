import Link from "next/link";
import DevicePipeline from "@/components/ops/DevicePipeline";
import QuickStats from "@/components/ops/QuickStats";
import DonationRequests from "@/components/ops/DonationRequests";
import InventoryOverview from "@/components/ops/InventoryOverview";
import ActivityFeed from "@/components/ops/ActivityFeed";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-navy/95 to-hti-navy">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Header */}
      <header
        className="relative overflow-hidden bg-gradient-to-r from-hti-navy via-hti-navy/98 to-hti-navy shadow-2xl border-b border-hti-orange/30"
        role="banner"
      >
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_left,_rgba(255,170,85,0.28),_transparent_55%)]" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 text-white">
                ⚡ HTI Operations HUB
              </h1>
              <p className="text-hti-yellow mt-2 text-lg font-medium">
                Mission Control • Real-Time Device Management
              </p>
            </div>
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" role="main">
        {/* Quick Stats Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span>⚡</span>
            Key Metrics
          </h2>
          <QuickStats />
        </section>

        {/* Device Pipeline Section */}
        <section>
          <DevicePipeline />
        </section>

        {/* Two Column Layout - Donation Requests & Activity Feed */}
        <div className="grid lg:grid-cols-2 gap-8">
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
        <section>
          <InventoryOverview />
        </section>
      </main>
    </div>
  );
}
