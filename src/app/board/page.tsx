import Link from "next/link";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import RecentActivity from "@/components/board/RecentActivity";
import CountyMap from "@/components/board/CountyMap";
// import TrendChart from "@/components/board/TrendChart"; // Temporarily disabled

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy via-hti-navy to-hti-gray text-white shadow-lg border-b-4 border-hti-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">HTI Board Dashboard</h1>
              <p className="text-hti-yellow text-lg font-medium">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-hti-red hover:bg-hti-orange text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Impact Metrics Grid */}
        <section className="mb-20">
          <div className="mb-10">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-hti-navy">Impact at a Glance</h2>
              <span className="px-3 py-1 bg-hti-red/10 text-hti-red text-xs font-bold rounded-full border border-hti-red/30">Live Data</span>
            </div>
            <p className="text-gray-700 mt-3 text-lg">
              Key performance indicators for the Digital Champion Grant and overall mission impact
            </p>
          </div>
          <ImpactMetrics />
        </section>

        {/* Divider */}
        <div className="my-20 border-t-2 border-hti-yellow/30" />

        {/* County Map */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Counties Served</h2>
            <p className="text-gray-700 text-lg">
              Geographic reach of HTI's Digital Champion Grant programming
            </p>
          </div>
          <CountyMap />
        </section>

        {/* Divider */}
        <div className="my-20 border-t-2 border-hti-yellow/30" />

        {/* Recent Activity */}
        <section>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Recent Activity</h2>
            <p className="text-gray-700 text-lg">
              Latest updates and milestones from the HTI team
            </p>
          </div>
          <RecentActivity />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-hti-yellow/20 bg-hti-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-hti-gray text-sm font-medium">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
