import Link from "next/link";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import RecentActivity from "@/components/board/RecentActivity";
import CountyMap from "@/components/board/CountyMap";
import TrendChart from "@/components/board/TrendChart";

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/55 via-white to-hti-sand/35">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Header */}
      <header
        className="relative overflow-hidden bg-gradient-to-r from-hti-navy via-hti-navy/95 to-hti-navy text-white shadow-xl"
        role="banner"
      >
        <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(circle_at_top_left,_rgba(77,203,255,0.35),_transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">HTI Board Dashboard</h1>
              <p className="text-hti-yellow text-lg font-medium">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-teal focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
              aria-label="Return to HUBDash home page"
            >
              ← Back to HUB
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24"
        role="main"
      >
        {/* Impact Metrics Grid */}
        <section>
          <div className="mb-10">
            <div className="glass-card glass-card--subtle shadow-glass px-6 py-7 md:px-8 md:py-9">
              <div className="glass-card__glow bg-gradient-to-br from-hti-navy/35 via-hti-teal/25 to-hti-navy/25" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-3xl md:text-4xl font-bold text-glass-bright tracking-tight">Impact at a Glance</h2>
                  <span className="glass-chip glass-chip--teal text-xs">Live data</span>
                </div>
                <p className="text-sm md:text-base text-glass-muted font-medium leading-relaxed">
                  Key performance indicators for the Digital Champion Grant and overall mission impact, refreshed in real time from HUBDash metrics.
                </p>
              </div>
            </div>
          </div>

          <ImpactMetrics />
        </section>

        {/* Trend Chart */}
        <section>
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-hti-navy">Momentum</h2>
              <p className="text-hti-stone mt-3 text-lg max-w-3xl">
                Year-to-date trajectory of laptops collected and Chromebooks distributed, scaled to current totals with live pacing milestones.
              </p>
            </div>
            <div className="glass-card glass-card--subtle shadow-glass px-5 py-4 text-sm text-glass-bright max-w-sm">
              <div className="text-xs text-glass-muted font-semibold tracking-wide mb-2">Current pace</div>
              <p className="font-semibold leading-relaxed">
                Trend animation replays every refresh so board members immediately see how quickly we are advancing toward annual goals.
              </p>
            </div>
          </div>
          <TrendChart />
        </section>

        {/* County Map */}
        <section>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Counties Served</h2>
            <p className="text-hti-stone text-lg">
              Geographic reach of HTI's Digital Champion Grant programming
            </p>
          </div>

          <div className="md:max-w-6xl mx-auto">
            <CountyMap />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="pb-6">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Recent Activity</h2>
            <p className="text-hti-stone text-lg">
              Latest updates and milestones from the HTI team
            </p>
          </div>
          <RecentActivity />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t glass-divider bg-hti-sand/60" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-hti-stone text-sm font-medium">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
