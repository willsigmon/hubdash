"use client";

import GlassCard from '@/components/ui/GlassCard';
import GradientHeading from '@/components/ui/GradientHeading';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2025');
  const [reportType, setReportType] = useState('quarterly');
  const [loading, setLoading] = useState(true);

  // State for live data from API
  const [metrics, setMetrics] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);

  // Fetch all data
  useEffect(() => {
    Promise.all([
      fetch('/api/metrics').then(r => r.json()).catch(() => null),
      fetch('/api/devices?limit=10000').then(r => r.json()).then(d => Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []).catch(() => []),
      fetch('/api/training').then(r => r.json()).then(d => Array.isArray(d) ? d : []).catch(() => []),
      fetch('/api/partners').then(r => r.json()).then(d => Array.isArray(d) ? d : []).catch(() => []),
    ]).then(([metricsData, devicesData, trainingData, partnersData]) => {
      setMetrics(metricsData);
      setDevices(devicesData);
      setTraining(trainingData);
      setPartners(partnersData);
      setLoading(false);
    });
  }, []);

  // Calculate exact numbers from real data
  const totalLaptopsReceived = devices.length;
  const distributedDevices = devices.filter((d: any) =>
    d.status === 'Distributed' || d.status === 'Completed-Presented' || d.status?.includes('Presented')
  ).length;
  const recycledDevices = devices.filter((d: any) =>
    d.status === 'Discarded' || d.status === 'Recycled' || d.status?.includes('eCycle')
  ).length;

  // Calculate training hours and participants from training sessions
  // Use actual hours field from training sessions, or default to 2 hours per session
  const totalTrainingHours = training.reduce((sum: number, t: any) => {
    const hours = t.hours ? parseFloat(String(t.hours)) : 2; // Default to 2 if not specified
    return sum + hours;
  }, 0);
  const totalParticipants = training.reduce((sum: number, t: any) => {
    return sum + (parseInt(String(t.attendees || 0), 10) || 0);
  }, 0);

  // Default grant data
  const GRANT_DATA = {
    laptopsConverted: metrics?.grantLaptopsPresented || 0,
    laptopsGoal: metrics?.grantLaptopGoal || 1500,
    trainingHours: totalTrainingHours,
    trainingHoursGoal: metrics?.grantTrainingHoursGoal || 125,
    participants: totalParticipants,
    participantsGoal: 600,
  };

  // Calculate percentages
  const laptopProgress = Math.round((GRANT_DATA.laptopsConverted / GRANT_DATA.laptopsGoal) * 100);
  const trainingProgress = Math.round((GRANT_DATA.trainingHours / GRANT_DATA.trainingHoursGoal) * 100);
  const participantProgress = Math.round((GRANT_DATA.participants / GRANT_DATA.participantsGoal) * 100);

  // Export functions
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Laptops Converted', GRANT_DATA.laptopsConverted],
      ['Training Hours', GRANT_DATA.trainingHours],
      ['Participants Trained', GRANT_DATA.participants],
      ['Total Laptops Received', totalLaptopsReceived],
      ['Distributed to Partners', distributedDevices],
      ['Responsibly Recycled', recycledDevices],
      ['Counties Served', metrics?.countiesServed || 0],
      ['Partner Organizations', partners.length],
    ];
    const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hti-report-${selectedQuarter.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>HTI Quarterly Accountability Report - ${selectedQuarter}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #1e3a5f; }
    h2 { color: #4a9b9f; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; font-weight: bold; }
  </style>
</head>
<body>
  <h1>HTI Quarterly Accountability Report</h1>
  <p><strong>Reporting Period:</strong> ${selectedQuarter}</p>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>

  <h2>Key Metrics</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Laptops Converted</td><td>${GRANT_DATA.laptopsConverted}</td></tr>
    <tr><td>Training Hours</td><td>${GRANT_DATA.trainingHours}</td></tr>
    <tr><td>Participants Trained</td><td>${GRANT_DATA.participants}</td></tr>
  </table>

  <h2>Device Metrics</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Total Laptops Received</td><td>${totalLaptopsReceived}</td></tr>
    <tr><td>Distributed to Partners</td><td>${distributedDevices}</td></tr>
    <tr><td>Responsibly Recycled</td><td>${recycledDevices}</td></tr>
  </table>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hti-report-${selectedQuarter.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-app">
      {/* Header - Compact */}
      <header className="sticky top-0 z-40 border-b border-default bg-gradient-to-br from-surface via-surface-alt to-surface shadow-lg theme-dim:from-hti-navy theme-dim:via-hti-navy-dark theme-dim:to-hti-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <GradientHeading as="h1" variant="accent" className="text-2xl md:text-3xl mb-1 text-primary theme-dim:text-white">Grant Reports</GradientHeading>
            <p className="text-secondary theme-dim:text-white/80 text-xs md:text-sm max-w-2xl hidden md:block">NCDIT Digital Champion Grant tracking and compliance reporting</p>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 accent-gradient px-4 py-2 rounded-lg text-on-accent text-xs font-semibold shadow-sm hover:shadow-md focus-ring"
          >
            ← HUB
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Grant Progress */}
        <section>
          <GlassCard elevation="lg" className="p-6 space-y-4">
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
                  <span className="text-[10px] px-2 py-1 bg-soft-highlight text-highlight border border-highlight rounded-full font-bold">{GRANT_DATA.laptopsGoal - GRANT_DATA.laptopsConverted} remaining</span>
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
                  <span className="text-[10px] px-2 py-1 bg-soft-accent text-accent border border-accent rounded-full font-bold">{GRANT_DATA.trainingHoursGoal - GRANT_DATA.trainingHours} hours left</span>
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
                  <span className="text-[10px] px-2 py-1 bg-soft-highlight text-highlight border border-highlight rounded-full font-bold">{GRANT_DATA.participantsGoal - GRANT_DATA.participants} more</span>
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
          <GlassCard elevation="md" className="p-6 space-y-4">
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
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('report-preview')?.offsetTop || 0, behavior: 'smooth' })}
                className="accent-gradient text-on-accent font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg text-sm focus-ring transition-all"
              >
                Generate Report
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('report-preview')?.offsetTop || 0, behavior: 'smooth' })}
                className="bg-surface-alt border border-default text-primary font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-surface text-sm focus-ring transition-all"
              >
                Preview Report
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-soft-accent text-accent border border-accent font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md text-sm focus-ring transition-all"
              >
                Export CSV
              </button>
            </div>
          </GlassCard>
        </section>

        {/* Report Preview */}
        <section id="report-preview">
          <GlassCard elevation="md" className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-primary tracking-tight">HTI Quarterly Accountability Report</h2>
              <p className="text-secondary text-xs md:text-sm font-medium">Reporting Period: <span className="text-primary font-bold">{selectedQuarter}</span> • Generated: <span className="text-primary font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            </div>
            <div className="space-y-6">
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
                  <div className="rounded-xl p-4 bg-soft-highlight border border-highlight">
                    <p className="text-highlight text-[10px] uppercase font-bold tracking-wider mb-1">Participants</p>
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
                      <span className="text-secondary font-medium text-sm sm:text-base">Total Laptops Received (Grant Cycle)</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{loading ? '—' : totalLaptopsReceived.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Successfully Converted to Chromebooks</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{GRANT_DATA.laptopsConverted.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Distributed to Community Partners</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{loading ? '—' : distributedDevices.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Responsibly Recycled</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{loading ? '—' : recycledDevices.toLocaleString()}</span>
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
                      <span className="text-secondary font-medium text-sm sm:text-base">Training Hours Delivered</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{GRANT_DATA.trainingHours} hours</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Individuals Trained</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{GRANT_DATA.participants} people</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Counties Served</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{loading ? '—' : (metrics?.countiesServed || 0)} counties</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-surface transition-colors">
                      <span className="text-secondary font-medium text-sm sm:text-base">Partner Organizations</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{loading ? '—' : partners.length} partners</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Compliance Statement */}
              <div className="rounded-xl p-6 border border-highlight bg-soft-highlight">
                <h4 className="font-bold text-highlight mb-3 text-base md:text-lg">Compliance & Audit Statement</h4>
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
            <GlassCard interactive elevation="sm" className="p-4 sm:p-6 text-center space-y-3">
              <div className="text-4xl sm:text-5xl">📄</div>
              <h3 className="font-bold text-primary text-base sm:text-lg">PDF Report</h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">Professional, print-ready report for NCDIT and stakeholder distribution</p>
              <button
                onClick={handleExportPDF}
                className="accent-gradient text-on-accent font-bold px-4 py-2.5 rounded-lg text-sm sm:text-base shadow-md hover:shadow-lg focus-ring w-full transition-all"
              >
                Download PDF
              </button>
            </GlassCard>
            <GlassCard interactive elevation="sm" className="p-4 sm:p-6 text-center space-y-3">
              <div className="text-4xl sm:text-5xl">📊</div>
              <h3 className="font-bold text-primary text-base sm:text-lg">Excel/CSV Data</h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">Raw dataset for custom analysis and reporting</p>
              <button
                onClick={handleExportCSV}
                className="accent-gradient text-on-accent font-bold px-4 py-2.5 rounded-lg text-sm sm:text-base shadow-md hover:shadow-lg focus-ring w-full transition-all"
              >
                Download CSV
              </button>
            </GlassCard>
            <GlassCard interactive elevation="sm" className="p-4 sm:p-6 text-center space-y-3">
              <div className="text-4xl sm:text-5xl">🌐</div>
              <h3 className="font-bold text-primary text-base sm:text-lg">HTML Report</h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">Web-ready format for online sharing and web viewing</p>
              <button
                onClick={handleExportHTML}
                className="accent-gradient text-on-accent font-bold px-4 py-2.5 rounded-lg text-sm sm:text-base shadow-md hover:shadow-lg focus-ring w-full transition-all"
              >
                Download HTML
              </button>
            </GlassCard>
          </div>
        </section>
      </main>
    </div>
  );
}
