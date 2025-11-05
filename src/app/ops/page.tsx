import Link from "next/link";
import DevicePipeline from "@/components/ops/DevicePipeline";
import QuickStats from "@/components/ops/QuickStats";
import DonationRequests from "@/components/ops/DonationRequests";
import InventoryOverview from "@/components/ops/InventoryOverview";
import ActivityFeed from "@/components/ops/ActivityFeed";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-red to-hti-yellow text-white shadow-2xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                ⚡ HTI Operations Hub
              </h1>
              <p className="text-white/90 mt-2 text-lg">
                Mission Control • Real-Time Device Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="text-xs text-white/70">System Status</div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  All Systems Operational
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm font-medium border border-white/30"
              >
                ← Back to Hub
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <section className="mb-8">
          <QuickStats />
        </section>

        {/* Device Pipeline */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🔄</span>
            Device Pipeline
          </h2>
          <DevicePipeline />
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Donation Requests */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">📬</span>
              Pending Donations
            </h2>
            <DonationRequests />
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">🔔</span>
              Live Activity
            </h2>
            <ActivityFeed />
          </section>
        </div>

        {/* Inventory Overview */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">📦</span>
            Inventory Overview
          </h2>
          <InventoryOverview />
        </section>
      </main>
    </div>
  );
}
