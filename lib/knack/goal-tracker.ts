/**
 * Skill 11: knack_goal_tracker
 * Tracks HTI's performance against grant and business goals
 */

import { HTIGrantGoals, HTI_2026_GOALS } from './types';

export interface GoalProgress {
  goal: number;
  current: number;
  percentage: number;
  remaining: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}

export interface HTIGoalReport {
  laptopsAcquired: GoalProgress;
  laptopsConverted: GoalProgress;
  trainingHours: GoalProgress;
  uniqueDonors: GoalProgress;
  recurringDonors: GoalProgress;
  grantMatching: GoalProgress;
  privateDonations: GoalProgress;
  corporateSponsors: GoalProgress;
  overallStatus: 'on-track' | 'needs-attention' | 'critical';
  projectedCompletion: Date | null;
}

export class KnackGoalTracker {
  private goals: HTIGrantGoals;

  constructor(goals: HTIGrantGoals = HTI_2026_GOALS) {
    this.goals = goals;
  }

  /**
   * Calculate progress for a single goal
   */
  private calculateProgress(goal: number, current: number): GoalProgress {
    const percentage = (current / goal) * 100;
    const remaining = goal - current;

    let status: GoalProgress['status'];
    if (percentage >= 100) {
      status = 'achieved';
    } else if (percentage >= 75) {
      status = 'on-track';
    } else if (percentage >= 50) {
      status = 'at-risk';
    } else {
      status = 'behind';
    }

    return {
      goal,
      current,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      status,
    };
  }

  /**
   * Check progress against all goals
   */
  checkProgress(liveData: {
    laptopsAcquired: number;
    laptopsConverted: number;
    trainingHours: number;
    uniqueDonors: number;
    recurringDonors: number;
    grantMatching: number;
    privateDonations: number;
    corporateSponsors: number;
  }): HTIGoalReport {
    const report: HTIGoalReport = {
      laptopsAcquired: this.calculateProgress(
        this.goals.laptopsAcquired,
        liveData.laptopsAcquired
      ),
      laptopsConverted: this.calculateProgress(
        this.goals.laptopsConverted,
        liveData.laptopsConverted
      ),
      trainingHours: this.calculateProgress(
        this.goals.trainingHours,
        liveData.trainingHours
      ),
      uniqueDonors: this.calculateProgress(
        this.goals.uniqueDonors,
        liveData.uniqueDonors
      ),
      recurringDonors: this.calculateProgress(
        this.goals.recurringDonors,
        liveData.recurringDonors
      ),
      grantMatching: this.calculateProgress(
        this.goals.grantMatching,
        liveData.grantMatching
      ),
      privateDonations: this.calculateProgress(
        this.goals.privateDonations,
        liveData.privateDonations
      ),
      corporateSponsors: this.calculateProgress(
        this.goals.corporateSponsors,
        liveData.corporateSponsors
      ),
      overallStatus: 'on-track',
      projectedCompletion: null,
    };

    // Determine overall status
    const criticalGoals = [
      report.laptopsAcquired,
      report.laptopsConverted,
      report.trainingHours,
    ];

    const hasCritical = criticalGoals.some(g => g.status === 'behind');
    const hasAtRisk = criticalGoals.some(g => g.status === 'at-risk');

    if (hasCritical) {
      report.overallStatus = 'critical';
    } else if (hasAtRisk) {
      report.overallStatus = 'needs-attention';
    }

    return report;
  }

  /**
   * Generate dashboard summary
   */
  generateDashboardSummary(report: HTIGoalReport): string {
    const lines = [
      '# HTI Grant Progress Dashboard',
      '',
      '## Core Grant Commitments (NCDIT/ARPA)',
      '',
      `**Laptops Acquired:** ${report.laptopsAcquired.current.toLocaleString()} / ${report.laptopsAcquired.goal.toLocaleString()} (${report.laptopsAcquired.percentage.toFixed(1)}%)`,
      `**Laptops Converted:** ${report.laptopsConverted.current.toLocaleString()} / ${report.laptopsConverted.goal.toLocaleString()} (${report.laptopsConverted.percentage.toFixed(1)}%)`,
      `**Training Hours:** ${report.trainingHours.current.toLocaleString()} / ${report.trainingHours.goal.toLocaleString()} (${report.trainingHours.percentage.toFixed(1)}%)`,
      '',
      '## Business Development Goals',
      '',
      `**Unique Donor Organizations:** ${report.uniqueDonors.current} / ${report.uniqueDonors.goal}`,
      `**Recurring Donors:** ${report.recurringDonors.current} / ${report.recurringDonors.goal}`,
      `**Grant Matching Funds:** $${report.grantMatching.current.toLocaleString()} / $${report.grantMatching.goal.toLocaleString()}`,
      `**Private Donations ($500+):** ${report.privateDonations.current} / ${report.privateDonations.goal}`,
      `**Corporate Sponsors:** ${report.corporateSponsors.current} / ${report.corporateSponsors.goal}`,
      '',
      `**Overall Status:** ${report.overallStatus.toUpperCase()}`,
    ];

    return lines.join('\n');
  }

  /**
   * Get variance analysis for quarterly reports
   */
  getVarianceAnalysis(
    report: HTIGoalReport,
    quarterNumber: number,
    totalQuarters: number = 8 // 2024-2026 = 8 quarters
  ): Record<string, any> {
    const expectedProgress = (quarterNumber / totalQuarters) * 100;

    return {
      laptopsAcquired: {
        expected: expectedProgress,
        actual: report.laptopsAcquired.percentage,
        variance: report.laptopsAcquired.percentage - expectedProgress,
      },
      laptopsConverted: {
        expected: expectedProgress,
        actual: report.laptopsConverted.percentage,
        variance: report.laptopsConverted.percentage - expectedProgress,
      },
      trainingHours: {
        expected: expectedProgress,
        actual: report.trainingHours.percentage,
        variance: report.trainingHours.percentage - expectedProgress,
      },
    };
  }
}
