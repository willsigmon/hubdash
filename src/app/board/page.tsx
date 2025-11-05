import Link from "next/link";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import RecentActivity from "@/components/board/RecentActivity";
import CountyMap from "@/components/board/CountyMap";
// import TrendChart from "@/components/board/TrendChart"; // Temporarily disabled

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy to-hti-navy/90 text-white shadow-xl border-b-4 border-hti-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">HTI Board Dashboard</h1>
              <p className="text-hti-teal-light text-lg">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-hti-teal hover:bg-hti-teal-light rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Impact Metrics Grid */}
        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl md:text-4xl font-bold text-hti-navy">Impact at a Glance</h2>
              <span className="text-sm font-semibold text-hti-red">Live Data</span>
            </div>
            <p className="text-gray-600 mt-2 text-lg">
              Key performance indicators for the Digital Champion Grant and overall mission impact
            </p>
          </div>
          <ImpactMetrics />
        </section>

        {/* Divider */}
        <div className="my-16 border-t-2 border-gray-200" />

        {/* County Map */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Counties Served</h2>
            <p className="text-gray-600 text-lg">
              Geographic reach of HTI's Digital Champion Grant programming
            </p>
          </div>
          <CountyMap />
        </section>

        {/* Divider */}
        <div className="my-16 border-t-2 border-gray-200" />

        {/* Recent Activity */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-hti-navy mb-2">Recent Activity</h2>
            <p className="text-gray-600 text-lg">
              Latest updates and milestones from the HTI team
            </p>
          </div>
          <RecentActivity />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-300 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            HTI Board Dashboard. Data updates in real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
