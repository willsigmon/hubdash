"use client";

import { Download, FileText, FileSpreadsheet, Globe, Calendar, Check, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ExportFormat = "pdf" | "csv" | "excel" | "html" | "json";
export type DateRange = "last30" | "last90" | "quarter" | "year" | "all" | "custom";

interface ExportWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: ExportFormat, dateRange: DateRange, customDates?: { start: string; end: string }) => Promise<void>;
    title?: string;
    availableFormats?: ExportFormat[];
}

export function ExportWizard({
    isOpen,
    onClose,
    onExport,
    title = "Export Data",
    availableFormats = ["pdf", "csv", "excel", "html", "json"],
}: ExportWizardProps) {
    const [format, setFormat] = useState<ExportFormat>("pdf");
    const [dateRange, setDateRange] = useState<DateRange>("all");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    if (!isOpen) return null;

    const formatOptions = [
        { value: "pdf" as ExportFormat, label: "PDF Report", icon: FileText, description: "Print-ready document" },
        { value: "csv" as ExportFormat, label: "CSV Data", icon: FileSpreadsheet, description: "Spreadsheet format" },
        { value: "excel" as ExportFormat, label: "Excel Workbook", icon: FileSpreadsheet, description: ".xlsx format" },
        { value: "html" as ExportFormat, label: "HTML Report", icon: Globe, description: "Web-ready format" },
        { value: "json" as ExportFormat, label: "JSON Data", icon: FileText, description: "Raw data export" },
    ].filter((opt) => availableFormats.includes(opt.value));

    const dateRangeOptions = [
        { value: "last30" as DateRange, label: "Last 30 Days" },
        { value: "last90" as DateRange, label: "Last 90 Days" },
        { value: "quarter" as DateRange, label: "This Quarter" },
        { value: "year" as DateRange, label: "This Year" },
        { value: "all" as DateRange, label: "All Time" },
        { value: "custom" as DateRange, label: "Custom Range" },
    ];

    const handleExport = async () => {
        setIsExporting(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            await onExport(
                format,
                dateRange,
                dateRange === "custom" ? { start: customStart, end: customEnd } : undefined
            );
            setProgress(100);
            setTimeout(() => {
                setIsExporting(false);
                setProgress(0);
                onClose();
            }, 500);
        } catch (error) {
            console.error("Export failed:", error);
            setIsExporting(false);
            setProgress(0);
        } finally {
            clearInterval(progressInterval);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-2xl border-2 border-default shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-default">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">{title}</h2>
                            <p className="text-sm text-secondary mt-1">Choose format and date range</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-alt transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-primary mb-3">File Format</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {formatOptions.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFormat(opt.value)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all text-left",
                                            format === opt.value
                                                ? "border-accent bg-soft-accent shadow-lg scale-105"
                                                : "border-default hover:border-accent/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon className={cn("w-5 h-5", format === opt.value ? "text-accent" : "text-muted")} />
                                            <span className={cn("font-semibold text-sm", format === opt.value ? "text-accent" : "text-primary")}>
                                                {opt.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-secondary">{opt.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Range Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-primary mb-3">Date Range</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {dateRangeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDateRange(opt.value)}
                                    className={cn(
                                        "px-4 py-3 rounded-lg border-2 transition-all font-semibold text-sm",
                                        dateRange === opt.value
                                            ? "border-accent bg-soft-accent text-accent"
                                            : "border-default hover:border-accent/50 text-primary"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {dateRange === "custom" && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-secondary mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-default rounded-lg bg-surface-alt text-primary focus:border-accent focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-secondary mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-default rounded-lg bg-surface-alt text-primary focus:border-accent focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-surface-alt rounded-xl border border-default">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted" />
                            <span className="text-xs font-semibold text-secondary uppercase">Preview</span>
                        </div>
                        <p className="text-sm text-primary">
                            Exporting as <span className="font-bold text-accent">{formatOptions.find((f) => f.value === format)?.label}</span>{" "}
                            for <span className="font-bold text-accent">{dateRangeOptions.find((d) => d.value === dateRange)?.label.toLowerCase()}</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-default flex items-center justify-between">
                    <button
                        onClick={onClose}
                        disabled={isExporting}
                        className="px-6 py-2.5 rounded-lg font-semibold bg-surface-alt text-primary hover:bg-surface border border-default transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    {isExporting ? (
                        <div className="flex items-center gap-3">
                            <div className="w-48 h-2 bg-surface-alt rounded-full overflow-hidden">
                                <div
                                    className="h-full accent-gradient transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-secondary">{progress}%</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleExport}
                            disabled={dateRange === "custom" && (!customStart || !customEnd)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold accent-gradient text-on-accent shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
