"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GradientHeading from '@/components/ui/GradientHeading';
import GlassCard from '@/components/ui/GlassCard';

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
    <div className="min-h-screen bg-app">
      {/* Header */}
      <header className="bg-surface-alt border-b border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <GradientHeading as="h1" className="text-3xl md:text-4xl mb-3">Grant Reports</GradientHeading>
            <p className="text-secondary text-base md:text-lg max-w-2xl">NCDIT Digital Champion Grant tracking and compliance reporting</p>
          </div>
          <Link
            href="/"
            className="accent-gradient px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-ring"
          >
            ← Back to HUB
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Grant Progress */}
        <section>
          <GlassCard elevation="lg" className="p-8 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎯</span>
                <h2 className="text-xl md:text-2xl font-bold text-primary">2024–2026 Grant Progress</h2>
              </div>
              <p className="text-secondary text-sm md:text-base">Real-time progress toward annual grant commitments</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Laptops Card */}
              <div className="rounded-xl p-6 bg-surface border border-default shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-muted text-xs font-bold uppercase tracking-wider mb-2">Laptops Converted</p>
                    <div className="flex items-baseline gap-2 font-bold">
                      <span className="text-3xl md:text-4xl text-primary">{GRANT_DATA.laptopsConverted}</span>
                      <span className="text-lg text-secondary">/ {GRANT_DATA.laptopsGoal}</span>
                    </div>
                  </div>
                  <span className="text-2xl md:text-3xl">💻</span>
                </div>
                <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-default mb-3">
                  <div className="h-full accent-gradient rounded-full transition-all" style={{ width: `${laptopProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent">{laptopProgress}% Complete</span>
                  <span className="text-[10px] px-2 py-1 bg-soft-warning text-warning border border-warning/40 rounded-full font-bold">{GRANT_DATA.laptopsGoal - GRANT_DATA.laptopsConverted} remaining</span>
                </div>
              </div>

              {/* Training Hours Card */}
              <div className="rounded-xl p-6 bg-surface border border-default shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-muted text-xs font-bold uppercase tracking-wider mb-2">Training Hours Delivered</p>
                    <div className="flex items-baseline gap-2 font-bold">
                      <span className="text-3xl md:text-4xl text-primary">{GRANT_DATA.trainingHours}</span>
                      <span className="text-lg text-secondary">/ {GRANT_DATA.trainingHoursGoal}</span>
                    </div>
                  </div>
                  <span className="text-2xl md:text-3xl">🎓</span>
                </div>
                <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-default mb-3">
                  <div className="h-full accent-gradient rounded-full transition-all" style={{ width: `${trainingProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent">{trainingProgress}% Complete</span>
                  <span className="text-[10px] px-2 py-1 bg-soft-accent text-accent border border-accent/40 rounded-full font-bold">{GRANT_DATA.trainingHoursGoal - GRANT_DATA.trainingHours} hours left</span>
                </div>
              </div>

              {/* Participants Card */}
              <div className="rounded-xl p-6 bg-surface border border-default shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-muted text-xs font-bold uppercase tracking-wider mb-2">Participants Trained</p>
                    <div className="flex items-baseline gap-2 font-bold">
                      <span className="text-3xl md:text-4xl text-primary">{GRANT_DATA.participants}</span>
                      <span className="text-lg text-secondary">/ {GRANT_DATA.participantsGoal}</span>
                    </div>
                  </div>
                  <span className="text-2xl md:text-3xl">👥</span>
                </div>
                <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-default mb-3">
                  <div className="h-full accent-gradient rounded-full transition-all" style={{ width: `${participantProgress}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent">{participantProgress}% Complete</span>
                  <span className="text-[10px] px-2 py-1 bg-soft-warning text-warning border border-warning/40 rounded-full font-bold">{GRANT_DATA.participantsGoal - GRANT_DATA.participants} more</span>
                </div>
              </div>
            </div>
            {/* Summary Stats */}
            <div className="rounded-xl p-6 bg-surface-alt border border-default">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-1">
                  <p className="text-muted text-xs font-bold uppercase tracking-wider">Counties Served</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{loading ? '—' : metrics?.countiesServed || 0}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-muted text-xs font-bold uppercase tracking-wider">Total Devices</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{loading ? '—' : (metrics?.totalLaptopsCollected || 0).toLocaleString()}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-muted text-xs font-bold uppercase tracking-wider">Community Partners</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{loading ? '—' : metrics?.partnerOrganizations || 0}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-muted text-xs font-bold uppercase tracking-wider">Total Distributed</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{loading ? '—' : (metrics?.totalChromebooksDistributed || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Report Configuration */}
        <section>
          <GlassCard elevation="md" className="p-8 space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <h2 className="text-xl md:text-2xl font-bold text-primary">Report Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-alt border border-default text-primary text-sm focus-ring"
                >
                  <option value="quarterly">Quarterly Accountability Report</option>
                  <option value="annual">Annual Summary</option>
                  <option value="device">Device Tracking Summary</option>
                  <option value="training">Training Impact Report</option>
                  <option value="donor">Donor Recognition Report</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Reporting Period</label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-alt border border-default text-primary text-sm focus-ring"
                >
                  <option value="Q1 2025">Q1 2025 (Jan-Mar)</option>
                  <option value="Q2 2025">Q2 2025 (Apr-Jun)</option>
                  <option value="Q3 2025">Q3 2025 (Jul-Sep)</option>
                  <option value="Q4 2025">Q4 2025 (Oct-Dec)</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="accent-gradient text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg text-sm focus-ring">Generate Report</button>
              <button className="bg-surface-alt border border-default text-primary font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-surface text-sm focus-ring">Preview Report</button>
              <button className="bg-soft-accent text-accent border border-accent/40 font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md text-sm focus-ring">Export CSV</button>
            </div>
          </GlassCard>
        </section>

        {/* Report Preview */}
        <section>
          <GlassCard elevation="md" className="p-10 space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">HTI Quarterly Accountability Report</h2>
              <p className="text-secondary text-sm md:text-base font-medium">Reporting Period: <span className="text-primary font-bold">{selectedQuarter}</span> • Generated: <span className="text-primary font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            </div>
            <div className="space-y-12">
              {/* Executive Summary */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4">Executive Summary</h3>
                <p className="text-secondary leading-relaxed text-sm md:text-base">
                  During {selectedQuarter}, HTI converted <span className="font-semibold text-primary">{GRANT_DATA.laptopsConverted}</span> laptops into secure HTI Chromebooks and delivered digital literacy training to participants across 15 counties. With <span className="font-semibold text-primary">{laptopProgress}% of laptops</span> converted and <span className="font-semibold text-primary">{trainingProgress}% of training hours</span> completed toward our 2026 goals, we remain on track to exceed all grant commitments.
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4 bg-surface-alt border border-default">
                    <p className="text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Laptops Converted</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{GRANT_DATA.laptopsConverted}</p>
                  </div>
                  <div className="rounded-xl p-4 bg-surface border border-default">
                    <p className="text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Training Hours</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{GRANT_DATA.trainingHours}</p>
                  </div>
                  <div className="rounded-xl p-4 bg-soft-warning border border-warning/30">
                    <p className="text-warning text-[10px] uppercase font-bold tracking-wider mb-1">Participants</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{GRANT_DATA.participants}</p>
                  </div>
                </div>
              </div>

              {/* Device Metrics */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4">Device Acquisition & Conversion</h3>
                <div className="rounded-lg overflow-hidden border border-default bg-surface-alt">
                  <ul className="divide-y divide-default">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Total Laptops Received (Grant Cycle)</span>
                      <span className="text-lg font-bold text-primary">3,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Successfully Converted to Chromebooks</span>
                      <span className="text-lg font-bold text-primary">{GRANT_DATA.laptopsConverted}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Distributed to Community Partners</span>
                      <span className="text-lg font-bold text-primary">2,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Responsibly Recycled</span>
                      <span className="text-lg font-bold text-primary">350+</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Training Metrics */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4">Digital Literacy Training Impact</h3>
                <div className="rounded-lg overflow-hidden border border-default bg-surface-alt">
                  <ul className="divide-y divide-default">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Training Hours Delivered</span>
                      <span className="text-lg font-bold text-primary">{GRANT_DATA.trainingHours} hours</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Individuals Trained</span>
                      <span className="text-lg font-bold text-primary">{GRANT_DATA.participants} people</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Counties Served</span>
                      <span className="text-lg font-bold text-primary">15 counties</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium">Partner Organizations</span>
                      <span className="text-lg font-bold text-primary">35+ partners</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Compliance Statement */}
              <div className="rounded-xl p-6 border border-warning/40 bg-soft-warning">
                <h4 className="font-bold text-warning mb-3 text-base md:text-lg">Compliance & Audit Statement</h4>
                <p className="text-secondary text-xs md:text-sm leading-relaxed">
                  All activities conducted in full accordance with NCDIT Digital Champion Grant requirements and American Rescue Plan Act (ARPA) guidelines. HTI maintains comprehensive financial records, device tracking documentation, and training participant registries. Supporting documentation available for audit upon request. Grant period: January 1, 2024 – December 31, 2026.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-default text-center">
                <p className="text-muted italic text-xs md:text-sm mb-3">Report generated by HTI Dashboard Intelligence Suite</p>
                <div className="text-primary font-bold text-xs md:text-sm">
                  <p>HUBZone Technology Initiative</p>
                  <p className="text-muted font-normal mt-1">Secure. Simple. Socially Good.</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Export Options - Better Layout */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📁</span>
            <h2 className="text-xl md:text-2xl font-bold text-primary">Export & Share Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard interactive elevation="sm" className="p-8 text-center space-y-4">
              <div className="text-4xl">📄</div>
              <h3 className="font-semibold text-primary text-base md:text-lg">PDF Report</h3>
              <p className="text-secondary text-xs md:text-sm">Professional, print-ready report for NCDIT and stakeholder distribution</p>
              <button className="accent-gradient text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md hover:shadow-lg focus-ring w-full">Download PDF</button>
            </GlassCard>
            <GlassCard interactive elevation="sm" className="p-8 text-center space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="font-semibold text-primary text-base md:text-lg">Excel/CSV Data</h3>
              <p className="text-secondary text-xs md:text-sm">Raw dataset for custom analysis and reporting</p>
              <button className="accent-gradient text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md hover:shadow-lg focus-ring w-full">Download CSV</button>
            </GlassCard>
            <GlassCard interactive elevation="sm" className="p-8 text-center space-y-4">
              <div className="text-4xl">🌐</div>
              <h3 className="font-semibold text-primary text-base md:text-lg">HTML Report</h3>
              <p className="text-secondary text-xs md:text-sm">Web-ready format for online sharing and web viewing</p>
              <button className="accent-gradient text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md hover:shadow-lg focus-ring w-full">Download HTML</button>
            </GlassCard>
          </div>
        </section>
      </main>
    </div>
  );
}
