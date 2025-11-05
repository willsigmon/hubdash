"use client";

import { useState } from "react";

interface SyncResult {
  table: string;
  success: boolean;
  recordsSynced: number;
  errors: string[];
}

interface SyncState {
  [key: string]: boolean;
}

const TABLES = [
  { name: 'devices', label: 'Devices', icon: '💻', description: 'Device inventory and status' },
  { name: 'donations', label: 'Donations', icon: '📦', description: 'Donation requests and inventory' },
  { name: 'partners', label: 'Partners', icon: '🤝', description: 'Partner organizations' },
];

export function TableSyncControls() {
  const [syncing, setSyncing] = useState<SyncState>({});
  const [results, setResults] = useState<Map<string, SyncResult>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const syncTable = async (tableName: string) => {
    setSyncing(prev => ({ ...prev, [tableName]: true }));
    setError(null);

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: tableName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sync failed');
      }

      // Update results
      const newResults = new Map(results);
      newResults.set(tableName, data);
      setResults(newResults);

      // Save to localStorage for health indicator
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      localStorage.setItem('lastSyncStatus', data.success ? 'success' : 'failed');
    } catch (err: any) {
      setError(`Failed to sync ${tableName}: ${err.message}`);
      console.error(`Sync error for ${tableName}:`, err);
    } finally {
      setSyncing(prev => ({ ...prev, [tableName]: false }));
    }
  };

  const getResultIcon = (result: SyncResult | undefined) => {
    if (!result) return null;
    return result.success ? '✅' : '❌';
  };

  const getResultColor = (result: SyncResult | undefined) => {
    if (!result) return 'bg-gray-50 border-gray-200';
    return result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TABLES.map((table) => {
          const result = results.get(table.name);
          const isSyncing = syncing[table.name];

          return (
            <div
              key={table.name}
              className={`border-2 rounded-lg p-4 transition-all ${getResultColor(result)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{table.icon}</span>
                  <div>
                    <h4 className="font-semibold text-hti-navy">{table.label}</h4>
                    <p className="text-xs text-gray-600 mt-1">{table.description}</p>
                  </div>
                </div>
                {result && (
                  <span className="text-xl">{getResultIcon(result)}</span>
                )}
              </div>

              {result && (
                <div className="mb-3 space-y-1 text-sm bg-white/50 p-2 rounded">
                  <p className="text-gray-700">
                    <span className="font-semibold">{result.recordsSynced}</span> records synced
                  </p>
                  {result.errors.length > 0 && (
                    <ul className="text-xs text-red-600 space-y-0.5 mt-1">
                      {result.errors.slice(0, 2).map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                      {result.errors.length > 2 && (
                        <li>• +{result.errors.length - 2} more errors</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              <button
                onClick={() => syncTable(table.name)}
                disabled={isSyncing}
                className="w-full px-4 py-2 bg-hti-teal hover:bg-hti-teal-light disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    🔄 Sync {table.label}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
