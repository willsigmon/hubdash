/**
 * Report Generator
 * Generates PDF reports with charts and HTI branding
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportConfig {
  title: string;
  subtitle?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sections: ReportSection[];
  branding?: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'chart' | 'metrics' | 'image';
  data: any;
  options?: any;
}

export class ReportGenerator {
  private pdf: jsPDF;
  private config: ReportConfig;
  private yPosition: number = 20;

  constructor(config: ReportConfig) {
    this.config = config;
    this.pdf = new jsPDF('p', 'mm', 'a4');

    // Set default branding
    this.config.branding = {
      primaryColor: '#008080',
      secondaryColor: '#191347',
      ...config.branding,
    };
  }

  async generate(): Promise<Blob> {
    await this.addHeader();
    await this.addSections();
    await this.addFooter();

    return this.pdf.output('blob');
  }

  private async addHeader(): Promise<void> {
    const { branding } = this.config;

    // Add logo if provided
    if (branding?.logo) {
      // Note: In a real implementation, you'd load and add the logo image
      // this.pdf.addImage(logo, 'PNG', 20, 20, 30, 30);
    }

    // Title
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(branding!.secondaryColor);
    this.pdf.text(this.config.title, 20, this.yPosition);

    this.yPosition += 10;

    // Subtitle
    if (this.config.subtitle) {
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(branding!.primaryColor);
      this.pdf.text(this.config.subtitle, 20, this.yPosition);
      this.yPosition += 10;
    }

    // Date range
    if (this.config.dateRange) {
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(100, 100, 100);
      const dateText = `Report Period: ${this.config.dateRange.start.toLocaleDateString()} - ${this.config.dateRange.end.toLocaleDateString()}`;
      this.pdf.text(dateText, 20, this.yPosition);
      this.yPosition += 10;
    }

    // Header line
    this.pdf.setDrawColor(branding!.primaryColor);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, this.yPosition, 190, this.yPosition);
    this.yPosition += 15;
  }

  private async addSections(): Promise<void> {
    for (const section of this.config.sections) {
      await this.addSection(section);
    }
  }

  private async addSection(section: ReportSection): Promise<void> {
    // Check if we need a new page
    if (this.yPosition > 250) {
      this.pdf.addPage();
      this.yPosition = 20;
    }

    // Section title
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(this.config.branding!.secondaryColor);
    this.pdf.text(section.title, 20, this.yPosition);
    this.yPosition += 8;

    // Section content
    switch (section.type) {
      case 'text':
        await this.addTextSection(section);
        break;
      case 'table':
        await this.addTableSection(section);
        break;
      case 'chart':
        await this.addChartSection(section);
        break;
      case 'metrics':
        await this.addMetricsSection(section);
        break;
      case 'image':
        await this.addImageSection(section);
        break;
    }

    this.yPosition += 10;
  }

  private async addTextSection(section: ReportSection): Promise<void> {
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(50, 50, 50);

    const lines = this.pdf.splitTextToSize(section.data, 170);
    this.pdf.text(lines, 20, this.yPosition);
    this.yPosition += lines.length * 5;
  }

  private async addTableSection(section: ReportSection): Promise<void> {
    const { data, options = {} } = section;

    this.pdf.autoTable({
      startY: this.yPosition,
      head: [data.headers],
      body: data.rows,
      theme: 'striped',
      headStyles: {
        fillColor: this.hexToRgb(this.config.branding!.primaryColor),
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 20, right: 20 },
      ...options,
    });

    this.yPosition = (this.pdf as any).lastAutoTable.finalY + 5;
  }

  private async addChartSection(section: ReportSection): Promise<void> {
    // For charts, we need to capture a canvas element
    if (section.data.canvas) {
      const canvas = section.data.canvas;
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions to fit the page
      const pageWidth = 170; // A4 width minus margins
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pageWidth / imgWidth;
      const displayHeight = imgHeight * ratio;

      this.pdf.addImage(imgData, 'PNG', 20, this.yPosition, pageWidth, displayHeight);
      this.yPosition += displayHeight + 5;
    }
  }

  private async addMetricsSection(section: ReportSection): Promise<void> {
    const metrics = section.data;

    this.pdf.setFontSize(12);
    this.pdf.setTextColor(this.config.branding!.secondaryColor);

    metrics.forEach((metric: any) => {
      this.pdf.text(`${metric.label}: ${metric.value}`, 30, this.yPosition);
      this.yPosition += 6;
    });
  }

  private async addImageSection(section: ReportSection): Promise<void> {
    // Similar to chart section but for static images
    const imgData = section.data;
    this.pdf.addImage(imgData, 'PNG', 20, this.yPosition, 100, 60);
    this.yPosition += 65;
  }

  private async addFooter(): Promise<void> {
    const pageCount = this.pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);

      // Footer line
      this.pdf.setDrawColor(this.config.branding!.primaryColor);
      this.pdf.setLineWidth(0.3);
      this.pdf.line(20, 280, 190, 280);

      // Footer text
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text('Generated by HUBDash - HTI Technology Initiative', 20, 285);
      this.pdf.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }
}

/**
 * Export utilities for different formats
 */
export class DataExporter {
  static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  static exportToJSON(data: any, filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  static async exportToPDF(config: ReportConfig, filename: string): Promise<void> {
    const generator = new ReportGenerator(config);
    const blob = await generator.generate();
    this.downloadBlob(blob, `${filename}.pdf`);
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async captureChartAsImage(chartElement: HTMLElement): Promise<string> {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    return canvas.toDataURL('image/png');
  }
}

/**
 * Scheduled Report Manager
 * Handles automated report generation and email delivery
 */
export class ScheduledReportManager {
  private static instance: ScheduledReportManager;
  private schedules: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): ScheduledReportManager {
    if (!ScheduledReportManager.instance) {
      ScheduledReportManager.instance = new ScheduledReportManager();
    }
    return ScheduledReportManager.instance;
  }

  scheduleReport(config: {
    id: string;
    reportConfig: ReportConfig;
    schedule: 'daily' | 'weekly' | 'monthly';
    emailRecipients: string[];
    enabled: boolean;
  }): void {
    this.cancelReport(config.id);

    if (!config.enabled) return;

    const interval = this.getIntervalMs(config.schedule);

    const timeout = setInterval(async () => {
      try {
        const generator = new ReportGenerator(config.reportConfig);
        const pdfBlob = await generator.generate();

        // In a real implementation, you'd send this via email
        console.log(`📧 Sending scheduled report to ${config.emailRecipients.join(', ')}`);
        console.log('Report blob size:', pdfBlob.size);

        // Here you would integrate with an email service like SendGrid, Resend, etc.

      } catch (error) {
        console.error('Failed to generate scheduled report:', error);
      }
    }, interval);

    this.schedules.set(config.id, timeout);
  }

  cancelReport(id: string): void {
    const timeout = this.schedules.get(id);
    if (timeout) {
      clearInterval(timeout);
      this.schedules.delete(id);
    }
  }

  private getIntervalMs(schedule: 'daily' | 'weekly' | 'monthly'): number {
    const day = 24 * 60 * 60 * 1000;
    switch (schedule) {
      case 'daily':
        return day;
      case 'weekly':
        return 7 * day;
      case 'monthly':
        return 30 * day; // Approximation
      default:
        return day;
    }
  }

  getActiveSchedules(): string[] {
    return Array.from(this.schedules.keys());
  }
}
