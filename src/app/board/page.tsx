import CountyMap from "@/components/board/CountyMap";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import { LiveImpactCounter } from "@/components/board/LiveImpactCounter";
import RecentActivity from "@/components/board/RecentActivity";
import TrendChart from "@/components/board/TrendChart";
import GradientHeading from "@/components/ui/GradientHeading";
import Link from "next/link";

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-hti-sand/40">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-plum via-hti-fig to-hti-midnight text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">HTI Board Dashboard</h1>
              <p className="text-hti-soleil text-lg font-medium">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-hti-ember to-hti-gold text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
        <div className="my-20 border-t border-hti-fig/10" />

        {/* Impact Metrics Grid */}
        <section className="mb-20">
          <div className="mb-10">
            <div className="flex items-baseline gap-3">
              <GradientHeading className="text-3xl md:text-4xl" from="hti-plum" to="hti-fig">Impact at a Glance</GradientHeading>
              <span className="px-3 py-1 bg-hti-ember/10 text-hti-ember text-xs font-bold rounded-full border border-hti-ember/30">Live Data</span>
            </div>
            <p className="text-hti-stone mt-3 text-lg">
              Key performance indicators for the Digital Champion Grant and overall mission impact
            </p>
          </div>
          <ImpactMetrics />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-hti-fig/10" />

        {/* Trend Chart */}
        <section className="mb-20">
          <TrendChart />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-hti-fig/10" />

        {/* County Map */}
        <section className="mb-20">
          <div className="mb-10">
            <GradientHeading className="text-3xl md:text-4xl mb-2" from="hti-ember" to="hti-gold">Counties Served</GradientHeading>
            <p className="text-hti-stone text-lg">
              Geographic reach of HTI's Digital Champion Grant programming
            </p>
          </div>
          <CountyMap />
        </section>

        {/* Divider */}
        <div className="my-20 border-t border-hti-fig/10" />

        {/* Recent Activity */}
        <section>
          <div className="mb-10">
            <GradientHeading className="text-3xl md:text-4xl mb-2" from="hti-plum" to="hti-soleil">Recent Activity</GradientHeading>
            <p className="text-hti-stone text-lg">
              Latest updates and milestones from the HTI team
            </p>
          </div>
          <RecentActivity />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-hti-fig/10 bg-hti-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-hti-stone text-sm font-medium">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
