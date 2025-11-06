'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2025');
  const [reportType, setReportType] = useState('quarterly');
  const [loading, setLoading] = useState(true);

  // State for live data from API
  const [metrics, setMetrics] = useState<any>(null);

  // Default grant data
  const GRANT_DATA = {
    laptopsConverted: metrics?.grantLaptopsPresented || 0,
    laptopsGoal: metrics?.grantLaptopGoal || 1500,
    trainingHours: metrics?.trainingHoursDelivered || 0, // Pull from actual training data
    trainingHoursGoal: metrics?.trainingHoursGoal || 125,
    participants: metrics?.peopleTrained || 0,
    participantsGoal: 600,
  };

  // Calculate percentages
  const laptopProgress = Math.round((GRANT_DATA.laptopsConverted / GRANT_DATA.laptopsGoal) * 100);
  const trainingProgress = Math.round((GRANT_DATA.trainingHours / GRANT_DATA.trainingHoursGoal) * 100);
  const participantProgress = Math.round((GRANT_DATA.participants / GRANT_DATA.participantsGoal) * 100);

  // Fetch live metrics
  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy via-hti-teal to-hti-teal-light text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Grant Reports</h1>
              </div>
              <p className="text-hti-teal-light text-lg">
                NCDIT Digital Champion Grant tracking and compliance reporting
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg transition-all text-sm font-semibold border border-white/20 hover:border-white/40"
            >
              ← Back to HUB
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Grant Progress Visualization - PROMINENT */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-hti-navy">
          <div className="bg-gradient-to-r from-hti-navy/5 to-hti-teal/5 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl font-bold text-hti-navy">2024-2026 Grant Progress</h2>
            </div>
            <p className="text-gray-600">Real-time progress toward annual grant commitments</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Laptops Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-1">Laptops Converted</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-hti-navy">{GRANT_DATA.laptopsConverted}</span>
                      <span className="text-lg text-gray-600">/ {GRANT_DATA.laptopsGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">💻</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-fill" style={{ width: `${laptopProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 font-semibold">{laptopProgress}% Complete</span>
                  <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-700 rounded-full font-medium">{GRANT_DATA.laptopsGoal - GRANT_DATA.laptopsConverted} remaining</span>
                </div>
              </div>

              {/* Training Hours Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-1">Training Hours Delivered</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-hti-navy">{GRANT_DATA.trainingHours}</span>
                      <span className="text-lg text-gray-600">/ {GRANT_DATA.trainingHoursGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">🎓</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-fill" style={{ width: `${trainingProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 font-semibold">{trainingProgress}% Complete</span>
                  <span className="text-xs px-3 py-1 bg-green-600/20 text-green-700 rounded-full font-medium">{GRANT_DATA.trainingHoursGoal - GRANT_DATA.trainingHours} hours left</span>
                </div>
              </div>

              {/* Participants Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-1">Participants Trained</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-hti-navy">{GRANT_DATA.participants}</span>
                      <span className="text-lg text-gray-600">/ {GRANT_DATA.participantsGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-fill" style={{ width: `${participantProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 font-semibold">{participantProgress}% Complete</span>
                  <span className="text-xs px-3 py-1 bg-purple-600/20 text-purple-700 rounded-full font-medium">{GRANT_DATA.participantsGoal - GRANT_DATA.participants} more</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-hti-navy/5 rounded-lg p-6 border border-hti-navy/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Counties Served</p>
                  <p className="text-2xl font-bold text-hti-navy">{loading ? '—' : metrics?.countiesServed || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Total Devices</p>
                  <p className="text-2xl font-bold text-hti-navy">{loading ? '—' : (metrics?.totalLaptopsCollected || 0).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Community Partners</p>
                  <p className="text-2xl font-bold text-hti-navy">{loading ? '—' : metrics?.partnerOrganizations || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Total Distributed</p>
                  <p className="text-2xl font-bold text-hti-navy">{loading ? '—' : (metrics?.totalChromebooksDistributed || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Configuration - Improved Layout */}
        <section className="bg-white rounded-xl shadow-md p-8 border-t-4 border-hti-teal">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-bold text-hti-navy">Report Configuration</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-hti-navy focus:border-hti-navy bg-white font-medium text-gray-800"
                >
                  <option value="quarterly">Quarterly Accountability Report</option>
                  <option value="annual">Annual Summary</option>
                  <option value="device">Device Tracking Summary</option>
                  <option value="training">Training Impact Report</option>
                  <option value="donor">Donor Recognition Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Reporting Period
                </label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-hti-navy focus:border-hti-navy bg-white font-medium text-gray-800"
                >
                  <option value="Q1 2025">Q1 2025 (Jan-Mar)</option>
                  <option value="Q2 2025">Q2 2025 (Apr-Jun)</option>
                  <option value="Q3 2025">Q3 2025 (Jul-Sep)</option>
                  <option value="Q4 2025">Q4 2025 (Oct-Dec)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons with Better Layout */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-primary flex-1 sm:flex-none">
                Generate Report
              </button>
              <button className="btn-secondary flex-1 sm:flex-none">
                Preview Report
              </button>
              <button className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 border-2 border-gray-400 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* Report Preview - Professional Typography */}
        <section className="bg-white rounded-xl shadow-lg p-10 border-t-4 border-hti-navy">
          <div className="border-l-4 border-hti-navy pl-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-hti-navy mb-3 tracking-tight">
                HTI Quarterly Accountability Report
              </h2>
              <p className="text-base text-gray-600 font-medium">
                Reporting Period: <span className="font-semibold text-hti-navy">{selectedQuarter}</span> | Generated: <span className="font-semibold text-hti-navy">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>

            <div className="space-y-8">
              {/* Executive Summary */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  During {selectedQuarter}, HTI converted <span className="font-semibold text-hti-navy">{GRANT_DATA.laptopsConverted}</span> laptops into secure HTI Chromebooks and delivered digital literacy training to participants across 15 counties. With <span className="font-semibold text-hti-navy">{laptopProgress}% of laptops</span> converted and <span className="font-semibold text-hti-navy">{trainingProgress}% of training hours</span> completed toward our 2026 goals, we remain on track to exceed all grant commitments.
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Laptops Converted</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.laptopsConverted}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Training Hours</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.trainingHours}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Participants</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.participants}</p>
                  </div>
                </div>
              </div>

              {/* Device Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Device Acquisition & Conversion</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <ul className="divide-y">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Total Laptops Received (Grant Cycle)</span>
                      <span className="text-xl font-bold text-hti-navy">3,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Successfully Converted to Chromebooks</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.laptopsConverted}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Distributed to Community Partners</span>
                      <span className="text-xl font-bold text-hti-navy">2,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Responsibly Recycled</span>
                      <span className="text-xl font-bold text-hti-navy">350+</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Training Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Digital Literacy Training Impact</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <ul className="divide-y">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Training Hours Delivered</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.trainingHours} hours</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Individuals Trained</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.participants} people</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Counties Served</span>
                      <span className="text-xl font-bold text-hti-navy">15 counties</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700 font-medium">Partner Organizations</span>
                      <span className="text-xl font-bold text-hti-navy">35+ partners</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Compliance Statement */}
              <div className="bg-gradient-to-r from-hti-navy/10 to-hti-teal/10 border-l-4 border-hti-navy p-6 rounded">
                <h4 className="font-bold text-hti-navy mb-3 text-lg">Compliance & Audit Statement</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  All activities conducted in full accordance with NCDIT Digital Champion Grant requirements and American Rescue Plan Act (ARPA) guidelines. HTI maintains comprehensive financial records, device tracking documentation, and training participant registries. Supporting documentation available for audit upon request. Grant period: January 1, 2024 – December 31, 2026.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t-2 border-gray-200 text-center">
                <p className="text-gray-600 italic text-sm mb-3">Report generated by HTI Dashboard Intelligence Suite</p>
                <div className="text-hti-navy font-bold text-sm">
                  <p>HUBZone Technology Initiative</p>
                  <p className="text-xs text-gray-600 font-normal mt-1">Secure. Simple. Socially Good.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Options - Better Layout */}
        <section>
          <h2 className="text-2xl font-bold text-hti-navy mb-6 flex items-center gap-2">
            <span>📁</span> Export & Share Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-500 p-8 text-center">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">PDF Report</h3>
              <p className="text-gray-600 text-sm mb-6">
                Professional, print-ready report for NCDIT and stakeholder distribution
              </p>
              <button className="btn-primary w-full">Download PDF</button>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-500 p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">Excel/CSV Data</h3>
              <p className="text-gray-600 text-sm mb-6">
                Raw dataset for custom analysis and reporting
              </p>
              <button className="btn-primary w-full">Download CSV</button>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-500 p-8 text-center">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">HTML Report</h3>
              <p className="text-gray-600 text-sm mb-6">
                Web-ready format for online sharing and web viewing
              </p>
              <button className="btn-primary w-full">Download HTML</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
