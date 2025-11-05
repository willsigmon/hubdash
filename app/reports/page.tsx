'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2025');
  const [reportType, setReportType] = useState('quarterly');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-hti-navy">Report Generator</h1>
        <p className="text-gray-600 mt-1">
          Generate NCDIT-compliant grant reports and stakeholder summaries
        </p>
      </div>

      {/* Report Configuration */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-hti-navy mb-4">Report Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hti-blue focus:border-transparent"
            >
              <option value="quarterly">Quarterly Accountability Report</option>
              <option value="annual">Annual Summary</option>
              <option value="device">Device Tracking Summary</option>
              <option value="training">Training Impact Report</option>
              <option value="donor">Donor Recognition Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reporting Period
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hti-blue focus:border-transparent"
            >
              <option value="Q1 2025">Q1 2025 (Jan-Mar)</option>
              <option value="Q2 2025">Q2 2025 (Apr-Jun)</option>
              <option value="Q3 2025">Q3 2025 (Jul-Sep)</option>
              <option value="Q4 2025">Q4 2025 (Oct-Dec)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="btn-primary">
            Generate Report
          </button>
          <button className="btn-secondary">
            Preview Report
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
        </div>
      </section>

      {/* Report Preview */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <div className="border-l-4 border-hti-blue pl-6">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">
            HTI Quarterly Accountability Report
          </h2>
          <p className="text-gray-600 mb-6">
            Reporting Period: {selectedQuarter} | Generated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6">
            {/* Executive Summary */}
            <div>
              <h3 className="text-lg font-semibold text-hti-navy mb-3">Executive Summary</h3>
              <p className="text-gray-700 leading-relaxed">
                During Q2 2025, HTI converted 125 laptops into secure HTI Chromebooks and delivered
                16 hours of digital literacy training to 94 participants across 8 counties. We remain
                on track to meet all grant commitments for the 2024-2026 grant cycle.
              </p>
            </div>

            {/* Device Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-hti-navy mb-3">
                Device Acquisition & Conversion
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between py-2 border-b">
                  <span>Laptops Acquired</span>
                  <span className="font-semibold">150</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Laptops Converted to HTI Chromebooks</span>
                  <span className="font-semibold">125</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Ready for Distribution</span>
                  <span className="font-semibold">45</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Presented to Community</span>
                  <span className="font-semibold">70</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Responsibly Recycled</span>
                  <span className="font-semibold">10</span>
                </li>
              </ul>
            </div>

            {/* Training Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-hti-navy mb-3">
                Digital Literacy Training
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between py-2 border-b">
                  <span>Training Hours Delivered</span>
                  <span className="font-semibold">16 hours</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Participants Served</span>
                  <span className="font-semibold">94 people</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Training Sessions</span>
                  <span className="font-semibold">8 sessions</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span>Counties Reached</span>
                  <span className="font-semibold">Wake, Durham, Halifax, Vance, Wilson, Franklin, Granville, Nash</span>
                </li>
              </ul>
            </div>

            {/* Goal Progress */}
            <div>
              <h3 className="text-lg font-semibold text-hti-navy mb-3">
                Grant Progress Against 2026 Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Laptops Acquired</span>
                    <span className="font-semibold text-green-600">42.9% complete</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '42.9%' }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">1,500 of 3,500 target</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Laptops Converted</span>
                    <span className="font-semibold text-green-600">40.0% complete</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '40%' }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">1,000 of 2,500 target</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Training Hours</span>
                    <span className="font-semibold text-green-600">48.1% complete</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '48.1%' }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">75 of 156 target hours</p>
                </div>
              </div>
            </div>

            {/* Compliance Statement */}
            <div className="bg-hti-navy bg-opacity-5 border-l-4 border-hti-navy p-4 rounded">
              <h4 className="font-semibold text-hti-navy mb-2">Compliance Statement</h4>
              <p className="text-sm text-gray-700">
                All activities conducted in accordance with NCDIT Digital Champion Grant requirements
                and American Rescue Plan Act (ARPA) guidelines. Financial records and supporting
                documentation available for audit upon request.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t text-center text-sm text-gray-500">
              <p className="italic">Report generated by HTI Dashboard Intelligence Suite</p>
              <p className="mt-2">
                HUBZone Technology Initiative • Secure. Simple. Socially Good.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Options */}
      <section>
        <h2 className="section-title">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="font-semibold text-hti-navy mb-2">PDF Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Branded, print-ready report for NCDIT and stakeholders
            </p>
            <button className="btn-primary w-full">Download PDF</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-hti-navy mb-2">Excel/CSV Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Raw data export for custom analysis
            </p>
            <button className="btn-primary w-full">Download CSV</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🌐</div>
            <h3 className="font-semibold text-hti-navy mb-2">HTML Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Web-ready format for sharing online
            </p>
            <button className="btn-primary w-full">Download HTML</button>
          </div>
        </div>
      </section>
    </div>
  );
}
