import Link from "next/link";
import DevicePipeline from "@/components/ops/DevicePipeline";
import QuickStats from "@/components/ops/QuickStats";
import DonationRequests from "@/components/ops/DonationRequests";
import InventoryOverview from "@/components/ops/InventoryOverview";
import ActivityFeed from "@/components/ops/ActivityFeed";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-gray to-hti-navy/90">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy via-hti-gray to-hti-navy shadow-2xl border-b-4 border-hti-red">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="px-4 py-2 bg-hti-red/20 backdrop-blur-sm rounded-lg border-2 border-hti-red">
                <div className="text-xs text-hti-yellow font-medium">System Status</div>
                <div className="text-sm font-bold flex items-center gap-2 text-white">
                  <span className="w-2 h-2 bg-hti-yellow rounded-full animate-pulse" />
                  All Systems Operational
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-hti-red hover:bg-hti-orange backdrop-blur-sm rounded-lg transition-all text-sm font-bold border-2 border-hti-red text-white shadow-lg"
              >
                ← Back to HUB
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
