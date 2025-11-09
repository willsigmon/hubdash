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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Live Impact Counter - Hero Section */}
        <section className="mb-20">
          <LiveImpactCounter />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-default" />

        {/* Impact Metrics Grid */}
        <section className="mb-20">
          <div className="mb-10">
            <div className="flex items-baseline gap-3">
              <GradientHeading className="text-3xl md:text-4xl">Impact at a Glance</GradientHeading>
              <span className="px-3 py-1 bg-soft-accent text-accent text-xs font-bold rounded-full border border-accent/30">Live Data</span>
            </div>
            <p className="text-secondary mt-3 text-lg">
              Key performance indicators for the Digital Champion Grant and overall mission impact
            </p>
          </div>
          <ImpactMetrics />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-default" />

        {/* Trend Chart */}
        <section className="mb-20">
          <TrendChart />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-default" />

        {/* County Map */}
        <section className="mb-20">
          <div className="mb-10">
            <GradientHeading className="text-3xl md:text-4xl mb-2" variant="accent">Counties Served</GradientHeading>
            <p className="text-secondary text-lg">
              Geographic reach of HTI's Digital Champion Grant programming
            </p>
          </div>
          <CountyMap />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-default" />

        {/* Recent Activity */}
        <section>
          <div className="mb-10">
            <GradientHeading className="text-3xl md:text-4xl mb-2" variant="navy">Recent Activity</GradientHeading>
            <p className="text-secondary text-lg">
              Latest updates and milestones from the HTI team
            </p>
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
