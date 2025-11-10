/**
 * Skill 10: knack_exporter
 * Creates shareable and compliant stakeholder reports
 */

import { QuarterlyReport } from './reporting';

export class KnackExporter {
  /**
   * Export quarterly report as JSON
   */
  exportJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export records as CSV
   */
  exportCSV(records: Record<string, any>[], filename?: string): string {
    if (records.length === 0) {
      return '';
    }

    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(','),
      ...records.map(record =>
        headers
          .map(header => {
            const value = record[header];
            const stringValue = value?.toString() || '';
            // Escape commas and quotes
            return stringValue.includes(',') || stringValue.includes('"')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  /**
   * Export report as markdown
   */
  exportMarkdown(report: QuarterlyReport): string {
    return `# HTI Quarterly Report: ${report.quarter}

## Period
${report.period.start} to ${report.period.end}

## Narrative Summary
${report.narrative}

## Device Metrics
| Metric | Count |
|--------|-------|
| Acquired | ${report.devices.acquired} |
| Converted | ${report.devices.converted} |
| Ready | ${report.devices.ready} |
| Presented | ${report.devices.presented} |
| Discarded | ${report.devices.discarded} |

## Training Metrics
| Metric | Value |
|--------|-------|
| Total Hours | ${report.training.totalHours} |
| Participants | ${report.training.totalParticipants} |
| Sessions | ${report.training.sessionCount} |
| Counties | ${report.training.countiesCovered.join(', ')} |

## Goal Progress
- **Laptops Acquired:** ${report.goals.laptopsAcquired.percentage.toFixed(1)}%
- **Laptops Converted:** ${report.goals.laptopsConverted.percentage.toFixed(1)}%
- **Training Hours:** ${report.goals.trainingHours.percentage.toFixed(1)}%

## Overall Status
${report.goals.overallStatus.toUpperCase()}
`;
  }

  /**
   * Export for NCDIT compliance (branded format)
   */
  exportNCDITCompliance(report: QuarterlyReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTI Quarterly Report - ${report.quarter}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      color: #0E2240;
    }
    .header {
      background: #0E2240;
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header .tagline {
      margin: 10px 0 0 0;
      color: #6FC3DF;
      font-size: 16px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      border: 2px solid #6FC3DF;
      padding: 20px;
      border-radius: 8px;
    }
    .metric-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #0E2240;
    }
    .metric-card .label {
      color: #666;
      margin-top: 5px;
    }
    .section {
      margin: 30px 0;
    }
    .section h2 {
      color: #0E2240;
      border-bottom: 3px solid #6FC3DF;
      padding-bottom: 10px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>HUBZone Technology Initiative</h1>
    <div class="tagline">Secure. Simple. Socially Good.</div>
    <div style="margin-top: 20px;">
      <strong>Quarterly Report:</strong> ${report.quarter}<br>
      <strong>Period:</strong> ${report.period.start} to ${report.period.end}
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${report.narrative}</p>
  </div>

  <div class="section">
    <h2>Device Acquisition & Conversion</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="value">${report.devices.acquired}</div>
        <div class="label">Acquired</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.devices.converted}</div>
        <div class="label">Converted</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.devices.ready}</div>
        <div class="label">Ready</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.devices.presented}</div>
        <div class="label">Presented</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Digital Literacy Training</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="value">${report.training.totalHours}</div>
        <div class="label">Training Hours</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.training.totalParticipants}</div>
        <div class="label">Participants</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.training.sessionCount}</div>
        <div class="label">Sessions</div>
      </div>
      <div class="metric-card">
        <div class="value">${report.training.countiesCovered.length}</div>
        <div class="label">Counties</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Progress Toward 2026 Goals</h2>
    <p><strong>Laptops Acquired:</strong> ${report.goals.laptopsAcquired.percentage.toFixed(1)}% (${report.goals.laptopsAcquired.current} / ${report.goals.laptopsAcquired.goal})</p>
    <p><strong>Laptops Converted:</strong> ${report.goals.laptopsConverted.percentage.toFixed(1)}% (${report.goals.laptopsConverted.current} / ${report.goals.laptopsConverted.goal})</p>
    <p><strong>Training Hours:</strong> ${report.goals.trainingHours.percentage.toFixed(1)}% (${report.goals.trainingHours.current} / ${report.goals.trainingHours.goal})</p>
  </div>

  <div class="footer">
    <p><strong>Compliance:</strong> All activities conducted in accordance with NCDIT Digital Champion Grant requirements and American Rescue Plan Act (ARPA) guidelines.</p>
    <p><em>Report generated by HTI Dashboard Intelligence Suite</em></p>
  </div>
</body>
</html>
`;
  }

  /**
   * Download helper for client-side
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
