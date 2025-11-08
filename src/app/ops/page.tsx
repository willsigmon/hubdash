import ActivityFeed from "@/components/ops/ActivityFeed";
import DevicePipelineFlow from "@/components/ops/DevicePipelineFlow";
import DonationRequests from "@/components/ops/DonationRequests";
import EquipmentInventory from "@/components/ops/EquipmentInventory";
import QuickStats from "@/components/ops/QuickStats";
import Link from "next/link";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-app">
      {/* Header */}
      <header className="bg-surface border-b border-default shadow">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 text-primary">
                ⚡ Operations HUB
              </h1>
              <p className="text-secondary mt-2 text-lg font-medium">
                Mission Control • Real-Time Device Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-soft-success rounded-lg border border-success/40">
                <div className="text-xs text-success font-medium">System Status</div>
                <div className="text-sm font-bold flex items-center gap-2 text-primary">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  All Systems Operational
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 accent-gradient rounded-lg transition-all text-sm font-bold text-white shadow hover:shadow-lg"
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
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <span>⚡</span>
            Key Metrics
          </h2>
          <QuickStats />
        </section>

        {/* Device Pipeline Section */}
        <section>
          <DevicePipelineFlow />
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
          <EquipmentInventory />
        </section>
      </main>
    </div>
  );
}
