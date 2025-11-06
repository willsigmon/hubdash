import Link from 'next/link';
import { GoalProgressCard } from '@/components/GoalProgressCard';
import { QuickStats } from '@/components/QuickStats';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hti-navy to-blue-900 text-white rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-4">
          HTI Dashboard Intelligence Suite
        </h2>
        <p className="text-lg text-gray-200 mb-6">
          Real-time grant compliance tracking, device management, and impact reporting
          for the NCDIT Digital Champion Grant (2024-2026).
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="btn-primary">
            View Full Dashboard
          </Link>
          <Link href="/reports" className="btn-secondary">
            Generate Report
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <QuickStats />

      {/* Goal Progress Overview */}
      <section>
        <h3 className="section-title">2026 Grant Goals Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GoalProgressCard
            title="Laptops Acquired"
            current={1500}
            goal={3500}
            label="devices"
          />
          <GoalProgressCard
            title="Laptops Converted"
            current={1000}
            goal={2500}
            label="HTI Chromebooks"
          />
          <GoalProgressCard
            title="Training Hours"
            current={75}
            goal={156}
            label="hours delivered"
          />
          <GoalProgressCard
            title="Unique Donors"
            current={8}
            goal={10}
            label="organizations"
          />
          <GoalProgressCard
            title="Recurring Donors"
            current={4}
            goal={6}
            label="committed"
          />
          <GoalProgressCard
            title="Corporate Sponsors"
            current={1}
            goal={2}
            label="secured"
          />
        </div>
      </section>

      {/* Service Area */}
      <section>
        <h3 className="section-title">15-County Service Area</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            HTI serves HUBZone communities across North Carolina and southern Virginia:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              'Wake', 'Durham', 'Vance', 'Franklin', 'Granville',
              'Halifax', 'Wilson', 'Edgecombe', 'Martin', 'Hertford',
              'Greene', 'Warren', 'Northampton', 'Person', 'Nash'
            ].map(county => (
              <div
                key={county}
                className="bg-hti-blue bg-opacity-10 border border-hti-blue rounded px-3 py-2 text-center text-sm font-medium text-hti-navy"
              >
                {county}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h3 className="section-title">About This Dashboard</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            This dashboard provides real-time visibility into HTI's grant performance and operational metrics.
            It integrates with Knack databases to track device acquisition, conversion, and distribution
            alongside digital literacy training delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border-l-4 border-hti-blue pl-4">
              <h4 className="font-bold text-hti-navy mb-2">Grant Compliance</h4>
              <p className="text-sm text-gray-600">
                Track progress against NCDIT and ARPA requirements with automated quarterly reports.
              </p>
            </div>
            <div className="border-l-4 border-hti-blue pl-4">
              <h4 className="font-bold text-hti-navy mb-2">Device Tracking</h4>
              <p className="text-sm text-gray-600">
                Monitor laptop acquisition, conversion, and distribution across all 15 counties.
              </p>
            </div>
            <div className="border-l-4 border-hti-blue pl-4">
              <h4 className="font-bold text-hti-navy mb-2">Impact Reporting</h4>
              <p className="text-sm text-gray-600">
                Generate branded, stakeholder-ready reports for funders and community partners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
