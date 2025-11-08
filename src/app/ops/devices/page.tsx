import { DeviceManagementTable } from "@/components/ops/DeviceManagementTable";
import Link from "next/link";

export default function DevicesPage() {
  return (
    <div className="min-h-screen bg-hti-sand/40">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-plum via-hti-fig to-hti-midnight text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Device Management</h1>
              <p className="text-hti-soleil text-lg font-medium">
                Full CRUD operations for HTI device inventory
              </p>
            </div>
            <Link
              href="/ops"
              className="px-6 py-3 bg-gradient-to-r from-hti-ember to-hti-gold text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              ← Back to Ops
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DeviceManagementTable />
      </main>
    </div>
  );
}
