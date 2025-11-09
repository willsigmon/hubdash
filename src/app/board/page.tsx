import CountyMap from "@/components/board/CountyMap";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import { LiveImpactCounter } from "@/components/board/LiveImpactCounter";
import RecentActivity from "@/components/board/RecentActivity";
import TrendChart from "@/components/board/TrendChart";
import GradientHeading from "@/components/ui/GradientHeading";
import Link from "next/link";

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-app">
      {/* Header */}
      <header className="bg-surface-alt border-b border-default shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <GradientHeading as="h1" className="text-4xl md:text-5xl mb-2">
                HTI Board Dashboard
              </GradientHeading>
              <p className="text-secondary text-lg font-medium">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 accent-gradient text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-ring"
            >
              ← Back to HUB
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-24">
        {/* Hero / Live Impact */}
        <section className="space-y-10">
          <LiveImpactCounter />
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <GradientHeading className="text-3xl md:text-4xl">Impact at a Glance</GradientHeading>
                  <span className="px-3 py-1 bg-soft-accent text-accent text-xs font-bold rounded-full border border-accent/30">Live Data</span>
                </div>
                <p className="text-secondary text-base md:text-lg max-w-2xl">
                  Key mission & grant KPIs updated continuously. The featured card tracks real-time progress toward the Digital Champion Grant laptop goal.
                </p>
              </div>
              <ImpactMetrics />
            </div>
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl border border-default p-6 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-2">Executive Highlights</h3>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex gap-2"><span className="text-accent font-bold">↗</span> Grant laptop presentations accelerating last 2 weeks</li>
                  <li className="flex gap-2"><span className="text-success font-bold">✓</span> Deployment rate holding above 40%</li>
                  <li className="flex gap-2"><span className="text-warning font-bold">⚠</span> Two counties nearing saturation thresholds</li>
                  <li className="flex gap-2"><span className="text-accent font-bold">★</span> Partner engagement expanding steadily</li>
                </ul>
              </div>
              <div className="bg-surface-alt rounded-2xl border border-default p-6 shadow-inner">
                <h4 className="text-sm font-bold text-secondary uppercase tracking-wide mb-4">Quick Links</h4>
                <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
                  <Link href="/ops" className="px-3 py-2 rounded-lg bg-soft-accent text-accent border border-accent/30 hover:bg-soft-accent/70 transition-colors">Operations</Link>
                  <Link href="/reports" className="px-3 py-2 rounded-lg bg-soft-warning text-warning border border-warning/30 hover:bg-soft-warning/70 transition-colors">Reports</Link>
                  <Link href="/board" className="px-3 py-2 rounded-lg bg-soft-success text-success border border-success/30 hover:bg-soft-success/70 transition-colors">Board</Link>
                  <Link href="/marketing" className="px-3 py-2 rounded-lg bg-soft-accent text-accent border border-accent/30 hover:bg-soft-accent/70 transition-colors">Marketing</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trends & Geography */}
        <section className="space-y-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-3">
                <GradientHeading className="text-3xl md:text-4xl" variant="navy">Momentum & Trajectory</GradientHeading>
                <p className="text-secondary text-base md:text-lg max-w-2xl">Rolling performance trends to anticipate capacity needs and outreach impact.</p>
              </div>
              <TrendChart />
            </div>
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl border border-default p-6 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-2">Regional Reach</h3>
                <p className="text-sm text-secondary mb-4">Distribution footprint across served counties highlighting growth corridors.</p>
                <CountyMap />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <GradientHeading className="text-3xl md:text-4xl mb-1" variant="accent">Recent Activity</GradientHeading>
              <p className="text-secondary text-base md:text-lg">Latest operational and impact milestones (auto-refreshing).</p>
            </div>
            <Link href="/reports" className="px-5 py-3 rounded-lg bg-surface-alt border border-default text-sm font-semibold text-secondary hover:text-primary transition-colors">View Detailed Reports →</Link>
          </div>
          <RecentActivity />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-default bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-secondary text-sm font-medium">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
