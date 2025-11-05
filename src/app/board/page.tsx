import Link from "next/link";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import RecentActivity from "@/components/board/RecentActivity";
import CountyMap from "@/components/board/CountyMap";
import TrendChart from "@/components/board/TrendChart";

export default function BoardDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-hti-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">HTI Board Dashboard</h1>
              <p className="text-hti-teal-light mt-1">
                Executive overview of impact and operations
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg transition-colors text-sm font-medium"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Metrics Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-hti-navy mb-4">Impact at a Glance</h2>
          <ImpactMetrics />
        </section>

        {/* Trends and Map Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section>
            <h2 className="text-2xl font-bold text-hti-navy mb-4">Growth Trends</h2>
            <TrendChart />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-hti-navy mb-4">Counties Served</h2>
            <CountyMap />
          </section>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-hti-navy mb-4">Recent Activity</h2>
          <RecentActivity />
        </section>
      </main>
    </div>
  );
}
