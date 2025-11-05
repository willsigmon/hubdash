"use client";

import { useEffect, useState } from "react";

interface TableStatus {
  name: string;
  records: number;
  status: 'success' | 'failed';
}

interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  totalRecords: number;
  tables: TableStatus[];
}

export function SyncHistoryTable() {
  const [history, setHistory] = useState<SyncHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sync/history');
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      } else {
        setError('Failed to load sync history');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusBadge = (status: 'success' | 'failed' | 'partial') => {
    const configs = {
      success: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        label: '✅ Success',
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        label: '❌ Failed',
      },
      partial: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        label: '⚠️ Partial',
      },
    };
    const config = configs[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 h-16 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sync history available yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-hti-navy">
            <th className="text-left py-3 px-4 font-semibold text-hti-navy">Timestamp</th>
            <th className="text-left py-3 px-4 font-semibold text-hti-navy">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-hti-navy">Total Records</th>
            <th className="text-center py-3 px-4 font-semibold text-hti-navy">Duration</th>
            <th className="text-left py-3 px-4 font-semibold text-hti-navy">Tables</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-gray-700">
                {formatTime(entry.timestamp)}
              </td>
              <td className="py-3 px-4">
                {getStatusBadge(entry.status)}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="font-semibold text-hti-navy">{entry.totalRecords}</span>
              </td>
              <td className="py-3 px-4 text-center text-gray-600">
                {entry.duration}s
              </td>
              <td className="py-3 px-4">
                <div className="space-y-1">
                  {entry.tables.map((table) => (
                    <div key={table.name} className="text-xs">
                      <span className="font-medium capitalize text-gray-700">{table.name}:</span>
                      <span className={`ml-2 ${table.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {table.status === 'success' ? '✅' : '❌'} {table.records} records
                      </span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
