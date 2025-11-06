/**
 * Skill 8: knack_reporting_sync
 * Automates Digital Champion Grant and quarterly reporting
 */

import { DeviceRecord, TrainingRecord } from './types';
import { HTIGoalReport } from './goal-tracker';

export interface QuarterlyReport {
  quarter: string;
  period: {
    start: string;
    end: string;
  };
  devices: {
    acquired: number;
    converted: number;
    ready: number;
    presented: number;
    discarded: number;
  };
  training: {
    totalHours: number;
    totalParticipants: number;
    sessionCount: number;
    countiesCovered: string[];
  };
  donors: {
    unique: number;
    recurring: number;
    newThisQuarter: number;
  };
  financial: {
    grantMatchingReceived: number;
    privateDonationsReceived: number;
  };
  goals: HTIGoalReport;
  narrative: string;
}

export class KnackReportingSync {
  /**
   * Generate quarterly report from datasets
   */
  generateQuarterlyReport(
    quarter: string,
    startDate: string,
    endDate: string,
    devices: DeviceRecord[],
    training: TrainingRecord[],
    goals: HTIGoalReport
  ): QuarterlyReport {
    const devicesInPeriod = this.filterByDateRange(devices, startDate, endDate);
    const trainingInPeriod = this.filterByDateRange(training, startDate, endDate);

    // Calculate device metrics
    const deviceMetrics = {
      acquired: devicesInPeriod.filter(d => d.status === 'acquired').length,
      converted: devicesInPeriod.filter(d => d.status === 'converted').length,
      ready: devicesInPeriod.filter(d => d.status === 'ready').length,
      presented: devicesInPeriod.filter(d => d.status === 'presented').length,
      discarded: devicesInPeriod.filter(d => d.status === 'discarded').length,
    };

    // Calculate training metrics
    const trainingMetrics = {
      totalHours: trainingInPeriod.reduce((sum, t) => sum + (t.hours || 0), 0),
      totalParticipants: trainingInPeriod.reduce((sum, t) => sum + (t.participants || 0), 0),
      sessionCount: trainingInPeriod.length,
      countiesCovered: [...new Set(trainingInPeriod.map(t => t.county))],
    };

    // Calculate donor metrics (simplified - would need donor records)
    const donorOrgs = new Set(devicesInPeriod.map(d => d.donor_org).filter(Boolean));
    const donorMetrics = {
      unique: donorOrgs.size,
      recurring: 0, // Would need historical analysis
      newThisQuarter: 0, // Would need historical comparison
    };

    // Financial metrics (would come from separate financial records)
    const financialMetrics = {
      grantMatchingReceived: 0,
      privateDonationsReceived: 0,
    };

    const narrative = this.generateNarrative(
      quarter,
      deviceMetrics,
      trainingMetrics,
      goals
    );

    return {
      quarter,
      period: { start: startDate, end: endDate },
      devices: deviceMetrics,
      training: trainingMetrics,
      donors: donorMetrics,
      financial: financialMetrics,
      goals,
      narrative,
    };
  }

  /**
   * Cross-reference against grant targets
   */
  crossReferenceTargets(
    report: QuarterlyReport,
    cumulativeData: {
      totalAcquired: number;
      totalConverted: number;
      totalTrainingHours: number;
    }
  ) {
    return {
      laptopsAcquired: {
        target: 3500,
        cumulative: cumulativeData.totalAcquired,
        thisQuarter: report.devices.acquired,
        percentageComplete: (cumulativeData.totalAcquired / 3500) * 100,
      },
      laptopsConverted: {
        target: 2500,
        cumulative: cumulativeData.totalConverted,
        thisQuarter: report.devices.converted,
        percentageComplete: (cumulativeData.totalConverted / 2500) * 100,
      },
      trainingHours: {
        target: 156,
        cumulative: cumulativeData.totalTrainingHours,
        thisQuarter: report.training.totalHours,
        percentageComplete: (cumulativeData.totalTrainingHours / 156) * 100,
      },
    };
  }

  /**
   * Generate NCDIT-compliant report format
   */
  generateNCDITReport(report: QuarterlyReport): string {
    const sections = [
      '# HTI Quarterly Accountability Report',
      `## Reporting Period: ${report.quarter}`,
      `**Date Range:** ${report.period.start} to ${report.period.end}`,
      '',
      '---',
      '',
      '## Executive Summary',
      report.narrative,
      '',
      '## Device Acquisition & Conversion',
      `- **Laptops Acquired:** ${report.devices.acquired}`,
      `- **Laptops Converted to HTI Chromebooks:** ${report.devices.converted}`,
      `- **Ready for Distribution:** ${report.devices.ready}`,
      `- **Presented to Community:** ${report.devices.presented}`,
      `- **Responsibly Recycled:** ${report.devices.discarded}`,
      '',
      '## Digital Literacy Training',
      `- **Training Hours Delivered:** ${report.training.totalHours}`,
      `- **Participants Served:** ${report.training.totalParticipants}`,
      `- **Training Sessions:** ${report.training.sessionCount}`,
      `- **Counties Reached:** ${report.training.countiesCovered.join(', ')}`,
      '',
      '## Grant Progress Against 2026 Goals',
      `- **Laptops Acquired:** ${report.goals.laptopsAcquired.percentage.toFixed(1)}% complete`,
      `- **Laptops Converted:** ${report.goals.laptopsConverted.percentage.toFixed(1)}% complete`,
      `- **Training Hours:** ${report.goals.trainingHours.percentage.toFixed(1)}% complete`,
      '',
      '## Compliance Statement',
      'All activities conducted in accordance with NCDIT Digital Champion Grant requirements and ARPA guidelines.',
      '',
      '---',
      '',
      '*Report generated by HTI Dashboard Intelligence Suite*',
    ];

    return sections.join('\n');
  }

  /**
   * Generate narrative summary
   */
  private generateNarrative(
    quarter: string,
    devices: any,
    training: any,
    goals: HTIGoalReport
  ): string {
    const highlights = [];

    if (devices.converted > 0) {
      highlights.push(
        `Converted ${devices.converted} laptops into secure HTI Chromebooks`
      );
    }

    if (training.totalHours > 0) {
      highlights.push(
        `Delivered ${training.totalHours} hours of digital literacy training to ${training.totalParticipants} participants across ${training.countiesCovered.length} counties`
      );
    }

    const status = goals.overallStatus === 'on-track'
      ? 'on track to meet all grant commitments'
      : 'actively working toward grant commitments';

    return `During ${quarter}, HTI ${highlights.join(' and ')}. We remain ${status} for the 2024-2026 grant cycle.`;
  }

  /**
   * Filter records by date range
   */
  private filterByDateRange<T extends { date?: string; acquisition_date?: string }>(
    records: T[],
    startDate: string,
    endDate: string
  ): T[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return records.filter(record => {
      const dateStr = record.date || record.acquisition_date;
      if (!dateStr) return false;

      const recordDate = new Date(dateStr);
      return recordDate >= start && recordDate <= end;
    });
  }
}
