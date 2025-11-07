import Link from "next/link";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import RecentActivity from "@/components/board/RecentActivity";
import CountyMap from "@/components/board/CountyMap";
import TrendChart from "@/components/board/TrendChart";
import HighlightsTicker from "@/components/board/HighlightsTicker";
import BoardPulse from "@/components/board/BoardPulse";
import PageHero from "@/components/layout/PageHero";
import PageSectionHeading from "@/components/layout/PageSectionHeading";

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/60 via-white to-hti-sand/40">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <PageHero
        title="Board Dashboard"
        subtitle="Executive overview of impact and operations"
        theme="navy"
        actions={(
          <Link
            href="/"
            className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-teal focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
            aria-label="Return to HUBDash home page"
          >
            ← Back to HUB
          </Link>
        )}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
        role="main"
      >
        {/* Impact Metrics Grid */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Impact Metrics"
            subtitle="Real-time snapshot of HTI's mission progress and community reach"
          />
          <ImpactMetrics />
        </section>

        <HighlightsTicker />

        {/* Trend Chart */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Momentum"
            subtitle="Year-to-date trajectory of laptops collected and Chromebooks distributed, scaled to current totals with live pacing milestones"
          />
          <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-6">
            <TrendChart />
            <BoardPulse />
          </div>
        </section>

        {/* County Map */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Counties Served"
            subtitle="Geographic reach of HTI's Digital Champion Grant programming"
            align="split"
            actions={<div className="glass-chip glass-chip--teal text-xs font-semibold">Live geographic coverage</div>}
          />
          <CountyMap />
        </section>

        {/* Recent Activity */}
        <section className="space-y-6">
          <PageSectionHeading
            title="Recent Activity"
            subtitle="Latest updates and milestones from the HTI team"
            align="split"
            actions={<span className="glass-chip glass-chip--slate text-xs font-semibold">Sourced from HUBDash social signal feed</span>}
          />
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
