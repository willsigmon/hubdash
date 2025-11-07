'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DataExporter, ReportGenerator, type ReportConfig } from '@/lib/export/report-generator';
import PageHero from '@/components/layout/PageHero';
import PageSectionHeading from '@/components/layout/PageSectionHeading';

export default function ReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2025');
  const [reportType, setReportType] = useState('quarterly');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const reportPreviewRef = useRef<HTMLDivElement>(null);

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

  // Export handlers
  const handleExportPDF = async () => {
    if (!metrics) return;
    setExporting('pdf');
    try {
      const reportConfig: ReportConfig = {
        title: `HTI ${reportType === 'quarterly' ? selectedQuarter : 'Annual'} Accountability Report`,
        subtitle: `NCDIT Digital Champion Grant - ${selectedQuarter}`,
        branding: {
          primaryColor: '#4a9b9f',
          secondaryColor: '#1e3a5f',
        },
        sections: [
          {
            title: 'Executive Summary',
            type: 'text',
            data: `During ${selectedQuarter}, HTI converted ${GRANT_DATA.laptopsConverted} laptops into secure HTI Chromebooks and delivered digital literacy training to participants across ${metrics.countiesServed || 15} counties. With ${laptopProgress}% of laptops converted and ${trainingProgress}% of training hours completed toward our 2026 goals, we remain on track to exceed all grant commitments.`,
          },
          {
            title: 'Key Metrics',
            type: 'metrics',
            data: [
              { label: 'Laptops Converted', value: GRANT_DATA.laptopsConverted },
              { label: 'Training Hours Delivered', value: GRANT_DATA.trainingHours },
              { label: 'Participants Trained', value: GRANT_DATA.participants },
              { label: 'Counties Served', value: metrics.countiesServed || 0 },
              { label: 'Total Devices Collected', value: metrics.totalLaptopsCollected || 0 },
              { label: 'Total Distributed', value: metrics.totalChromebooksDistributed || 0 },
            ],
          },
          {
            title: 'Device Acquisition & Conversion',
            type: 'table',
            data: {
              headers: ['Metric', 'Value'],
              rows: [
                ['Total Laptops Received (Grant Cycle)', '3,500+'],
                ['Successfully Converted to Chromebooks', String(GRANT_DATA.laptopsConverted)],
                ['Distributed to Community Partners', '2,500+'],
                ['Responsibly Recycled', '350+'],
              ],
            },
          },
          {
            title: 'Digital Literacy Training Impact',
            type: 'table',
            data: {
              headers: ['Metric', 'Value'],
              rows: [
                ['Training Hours Delivered', `${GRANT_DATA.trainingHours} hours`],
                ['Individuals Trained', `${GRANT_DATA.participants} people`],
                ['Counties Served', `${metrics.countiesServed || 15} counties`],
                ['Partner Organizations', `${metrics.partnerOrganizations || 35}+ partners`],
              ],
            },
          },
        ],
      };

      const filename = `HTI-${reportType}-${selectedQuarter.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      await DataExporter.exportToPDF(reportConfig, filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportCSV = () => {
    if (!metrics) return;
    setExporting('csv');
    try {
      const csvData = [
        {
          'Report Period': selectedQuarter,
          'Report Type': reportType,
          'Laptops Converted': GRANT_DATA.laptopsConverted,
          'Laptops Goal': GRANT_DATA.laptopsGoal,
          'Laptop Progress %': laptopProgress,
          'Training Hours': GRANT_DATA.trainingHours,
          'Training Hours Goal': GRANT_DATA.trainingHoursGoal,
          'Training Progress %': trainingProgress,
          'Participants Trained': GRANT_DATA.participants,
          'Participants Goal': GRANT_DATA.participantsGoal,
          'Participants Progress %': participantProgress,
          'Counties Served': metrics.countiesServed || 0,
          'Total Devices Collected': metrics.totalLaptopsCollected || 0,
          'Total Distributed': metrics.totalChromebooksDistributed || 0,
          'Partner Organizations': metrics.partnerOrganizations || 0,
          'Generated Date': new Date().toISOString(),
        },
      ];

      const filename = `HTI-${reportType}-${selectedQuarter.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      DataExporter.exportToCSV(csvData, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportHTML = () => {
    if (!reportPreviewRef.current) return;
    setExporting('html');
    try {
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTI ${selectedQuarter} Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; color: #2b2829; }
    h1 { color: #1e3a5f; border-bottom: 4px solid #ff6b6b; padding-bottom: 10px; }
    h2 { color: #1e3a5f; margin-top: 40px; }
    .metric { background: #f4f1ea; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #1e3a5f; text-align: center; color: #666; }
  </style>
</head>
<body>
  ${reportPreviewRef.current.innerHTML}
  <div class="footer">
    <p>Generated by HUBDash - HTI Technology Initiative</p>
    <p>HUBZone Technology Initiative - Secure. Simple. Socially Good.</p>
  </div>
</body>
</html>`;

      const filename = `HTI-${reportType}-${selectedQuarter.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to export HTML. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handlePreviewReport = () => {
    if (reportPreviewRef.current) {
      reportPreviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-hti-sand/60 via-white to-hti-sand/40">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Header */}
      <PageHero
        title="Grant Reports"
        subtitle="NCDIT Digital Champion Grant tracking and compliance reporting"
        icon={<span role="img" aria-label="chart">📊</span>}
        theme="navy"
        actions={(
          <Link
            href="/"
            className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
            aria-label="Return to HUBDash home page"
          >
            ← Back to HUB
          </Link>
        )}
      />

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" role="main">

        {/* Grant Progress Visualization - PROMINENT */}
        <section className="glass-card glass-card--subtle shadow-glass overflow-hidden">
          <div className="px-8 py-6 glass-divider">
            <PageSectionHeading
              icon={<span className="text-3xl" aria-hidden>🎯</span>}
              title="2024-2026 Grant Progress"
              subtitle="Real-time progress toward annual grant commitments"
              size="md"
              tone="light"
            />
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Laptops Card */}
              <div className="glass-card glass-card--subtle shadow-glass p-6 flex flex-col gap-5 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-glass-muted text-xs font-semibold uppercase tracking-wide">Laptops Converted</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-glass-bright">{GRANT_DATA.laptopsConverted}</span>
                      <span className="text-lg text-glass-muted">/ {GRANT_DATA.laptopsGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">💻</span>
                </div>
                <div className="glass-track h-2.5">
                  <div className="glass-track__fill" style={{ width: `${laptopProgress}%` }} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-glass-bright font-semibold">{laptopProgress}% Complete</span>
                  <span className="glass-chip glass-chip--orange text-xs">{GRANT_DATA.laptopsGoal - GRANT_DATA.laptopsConverted} remaining</span>
                </div>
              </div>

              {/* Training Hours Card */}
              <div className="glass-card glass-card--subtle shadow-glass p-6 flex flex-col gap-5 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-glass-muted text-xs font-semibold uppercase tracking-wide">Training Hours Delivered</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-glass-bright">{GRANT_DATA.trainingHours}</span>
                      <span className="text-lg text-glass-muted">/ {GRANT_DATA.trainingHoursGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">🎓</span>
                </div>
                <div className="glass-track h-2.5">
                  <div className="glass-track__fill" style={{ width: `${trainingProgress}%` }} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-glass-bright font-semibold">{trainingProgress}% Complete</span>
                  <span className="glass-chip glass-chip--navy text-xs">{GRANT_DATA.trainingHoursGoal - GRANT_DATA.trainingHours} hours left</span>
                </div>
              </div>

              {/* Participants Card */}
              <div className="glass-card glass-card--subtle shadow-glass p-6 flex flex-col gap-5 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-glass-muted text-xs font-semibold uppercase tracking-wide">Participants Trained</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-glass-bright">{GRANT_DATA.participants}</span>
                      <span className="text-lg text-glass-muted">/ {GRANT_DATA.participantsGoal}</span>
                    </div>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
                <div className="glass-track h-2.5">
                  <div className="glass-track__fill" style={{ width: `${participantProgress}%` }} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-glass-bright font-semibold">{participantProgress}% Complete</span>
                  <span className="glass-chip glass-chip--yellow text-xs">{GRANT_DATA.participantsGoal - GRANT_DATA.participants} more</span>
                </div>
              </div>
            </div>

            <div className="glass-card glass-card--subtle shadow-glass p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-glass-muted text-sm mb-1">Counties Served</p>
                  <p className="text-2xl font-bold text-glass-bright">{loading ? '—' : metrics?.countiesServed || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-glass-muted text-sm mb-1">Total Devices</p>
                  <p className="text-2xl font-bold text-glass-bright">{loading ? '—' : (metrics?.totalLaptopsCollected || 0).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-glass-muted text-sm mb-1">Community Partners</p>
                  <p className="text-2xl font-bold text-glass-bright">{loading ? '—' : metrics?.partnerOrganizations || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-glass-muted text-sm mb-1">Total Distributed</p>
                  <p className="text-2xl font-bold text-glass-bright">{loading ? '—' : (metrics?.totalChromebooksDistributed || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Configuration - Improved Layout */}
        <section className="glass-card glass-card--subtle shadow-glass p-8">
          <PageSectionHeading
            icon={<span className="text-2xl" aria-hidden>⚙️</span>}
            title="Report Configuration"
            size="md"
            tone="light"
          />

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-glass-muted mb-3">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="glass-input glass-input--select text-sm font-medium"
                  aria-label="Select report type"
                >
                  <option value="quarterly">Quarterly Accountability Report</option>
                  <option value="annual">Annual Summary</option>
                  <option value="device">Device Tracking Summary</option>
                  <option value="training">Training Impact Report</option>
                  <option value="donor">Donor Recognition Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-glass-muted mb-3">
                  Reporting Period
                </label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="glass-input glass-input--select text-sm font-medium"
                  aria-label="Select reporting period"
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
                onClick={handlePreviewReport}
                className="glass-button glass-button--accent flex-1 sm:flex-none"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Preview Report'}
              </button>
              <button
                onClick={handleExportCSV}
                className="glass-button flex-1 sm:flex-none"
                disabled={loading || exporting === 'csv'}
              >
                {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={handleExportPDF}
                className="glass-button flex-1 sm:flex-none"
                disabled={loading || exporting === 'pdf'}
              >
                {exporting === 'pdf' ? 'Generating...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </section>

        {/* Report Preview - Professional Typography */}
        <section ref={reportPreviewRef} className="bg-white rounded-2xl shadow-xl p-10 border border-hti-navy/10">
          <div className="border-l-4 border-hti-orange pl-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-hti-navy mb-3 tracking-tight">
                HTI Quarterly Accountability Report
              </h2>
              <p className="text-base text-hti-stone font-medium">
                Reporting Period: <span className="font-semibold text-hti-navy">{selectedQuarter}</span> | Generated: <span className="font-semibold text-hti-navy">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>

            <div className="space-y-8">
              {/* Executive Summary */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Executive Summary</h3>
                <p className="text-hti-stone leading-relaxed text-base">
                  During {selectedQuarter}, HTI converted <span className="font-semibold text-hti-navy">{GRANT_DATA.laptopsConverted}</span> laptops into secure HTI Chromebooks and delivered digital literacy training to participants across 15 counties. With <span className="font-semibold text-hti-navy">{laptopProgress}% of laptops</span> converted and <span className="font-semibold text-hti-navy">{trainingProgress}% of training hours</span> completed toward our 2026 goals, we remain on track to exceed all grant commitments.
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-hti-sand rounded-xl p-4 border border-hti-navy/10">
                    <p className="text-hti-stone text-xs uppercase tracking-wide mb-1">Laptops Converted</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.laptopsConverted}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-hti-navy/10">
                    <p className="text-hti-stone text-xs uppercase tracking-wide mb-1">Training Hours</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.trainingHours}</p>
                  </div>
                  <div className="bg-hti-yellow/10 rounded-xl p-4 border border-hti-yellow-orange/20">
                    <p className="text-hti-stone text-xs uppercase tracking-wide mb-1">Participants</p>
                    <p className="text-3xl font-bold text-hti-navy">{GRANT_DATA.participants}</p>
                  </div>
                </div>
              </div>

              {/* Device Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Device Acquisition & Conversion</h3>
                <div className="bg-hti-sand/60 rounded-lg overflow-hidden">
                  <ul className="divide-y-2 divide-hti-navy/20">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Total Laptops Received (Grant Cycle)</span>
                      <span className="text-xl font-bold text-hti-navy">3,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Successfully Converted to Chromebooks</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.laptopsConverted}</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Distributed to Community Partners</span>
                      <span className="text-xl font-bold text-hti-navy">2,500+</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Responsibly Recycled</span>
                      <span className="text-xl font-bold text-hti-navy">350+</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Training Metrics */}
              <div>
                <h3 className="text-xl font-bold text-hti-navy mb-4">Digital Literacy Training Impact</h3>
                <div className="bg-hti-sand/60 rounded-lg overflow-hidden">
                  <ul className="divide-y-2 divide-hti-navy/20">
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Training Hours Delivered</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.trainingHours} hours</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Individuals Trained</span>
                      <span className="text-xl font-bold text-hti-navy">{GRANT_DATA.participants} people</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Counties Served</span>
                      <span className="text-xl font-bold text-hti-navy">15 counties</span>
                    </li>
                    <li className="flex justify-between items-center py-3 px-4 hover:bg-hti-yellow/15 transition-colors">
                      <span className="text-hti-stone font-medium">Partner Organizations</span>
                      <span className="text-xl font-bold text-hti-navy">35+ partners</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Compliance Statement */}
              <div className="bg-gradient-to-r from-hti-navy/12 to-hti-orange/12 border-l-4 border-hti-orange p-6 rounded-xl">
                <h4 className="font-bold text-hti-navy mb-3 text-lg">Compliance & Audit Statement</h4>
                <p className="text-hti-stone text-sm leading-relaxed">
                  All activities conducted in full accordance with NCDIT Digital Champion Grant requirements and American Rescue Plan Act (ARPA) guidelines. HTI maintains comprehensive financial records, device tracking documentation, and training participant registries. Supporting documentation available for audit upon request. Grant period: January 1, 2024 – December 31, 2026.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-hti-navy/10 text-center">
                <p className="text-hti-stone italic text-sm mb-3">Report generated by HTI Dashboard Intelligence Suite</p>
                <div className="text-hti-plum font-bold text-sm">
                  <p>HUBZone Technology Initiative</p>
                  <p className="text-xs text-hti-stone font-normal mt-1">Secure. Simple. Socially Good.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Options - Better Layout */}
        <section>
          <PageSectionHeading
            icon={<span className="text-2xl" aria-hidden>📁</span>}
            title="Export & Share Options"
            size="md"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-hti-orange p-8 text-center border border-hti-navy/10">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">PDF Report</h3>
              <p className="text-hti-stone text-sm mb-6">
                Professional, print-ready report for NCDIT and stakeholder distribution
              </p>
              <button
                onClick={handleExportPDF}
                disabled={loading || exporting === 'pdf'}
                className="glass-button glass-button--accent w-full focus:outline-none focus:ring-2 focus:ring-hti-orange focus:ring-offset-2"
              >
                {exporting === 'pdf' ? 'Generating...' : 'Download PDF'}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-hti-yellow-orange p-8 text-center border border-hti-navy/10">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">Excel/CSV Data</h3>
              <p className="text-hti-stone text-sm mb-6">
                Raw dataset for custom analysis and reporting
              </p>
              <button
                onClick={handleExportCSV}
                disabled={loading || exporting === 'csv'}
                className="glass-button glass-button--accent w-full focus:outline-none focus:ring-2 focus:ring-hti-orange focus:ring-offset-2"
              >
                {exporting === 'csv' ? 'Exporting...' : 'Download CSV'}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-hti-navy p-8 text-center border border-hti-navy/10">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="font-bold text-hti-navy text-lg mb-2">HTML Report</h3>
              <p className="text-hti-stone text-sm mb-6">
                Web-ready format for online sharing and web viewing
              </p>
              <button
                onClick={handleExportHTML}
                disabled={loading || exporting === 'html'}
                className="glass-button glass-button--accent w-full focus:outline-none focus:ring-2 focus:ring-hti-orange focus:ring-offset-2"
              >
                {exporting === 'html' ? 'Exporting...' : 'Download HTML'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
