"use client";

import { useState } from "react";

interface ExportFormat {
  format: 'json' | 'csv';
  label: string;
  icon: string;
  description: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    format: 'json',
    label: 'JSON',
    icon: '📄',
    description: 'Structured data format for developers',
  },
  {
    format: 'csv',
    label: 'CSV',
    icon: '📊',
    description: 'Spreadsheet format for analysis',
  },
];

export function ExportControls() {
  const [exporting, setExporting] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(prev => ({ ...prev, [format]: true }));
    setMessage(null);

    try {
      const response = await fetch(`/api/sync`);
      const syncData = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch data for export');
      }

      // Prepare data based on format
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = JSON.stringify(syncData, null, 2);
        filename = `hubdash-sync-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // Convert to CSV
        const headers = ['Table', 'Status', 'Records Synced', 'Errors'];
        const rows = syncData.results.map((r: any) => [
          r.table,
          r.success ? 'Success' : 'Failed',
          r.recordsSynced,
          r.errors.join('; '),
        ]);

        content = [
          headers.join(','),
          ...rows.map((row: string[]) =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n');

        filename = `hubdash-sync-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: `✅ Exported as ${format.toUpperCase()} (${filename})`,
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: `❌ Export failed: ${err.message}`,
      });
    } finally {
      setExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download current sync results and system data in your preferred format.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPORT_FORMATS.map((fmt) => (
          <button
            key={fmt.format}
            onClick={() => handleExport(fmt.format)}
            disabled={exporting[fmt.format]}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-hti-teal hover:bg-hti-teal/5 disabled:bg-gray-100 disabled:border-gray-300 transition-all text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{fmt.icon}</span>
                <div>
                  <h4 className="font-semibold text-hti-navy">{fmt.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{fmt.description}</p>
                </div>
              </div>
              {exporting[fmt.format] && (
                <svg className="animate-spin h-4 w-4 text-hti-teal" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Export data regularly to maintain backups and audit trails of your sync operations.
        </p>
      </div>
    </div>
  );
}
