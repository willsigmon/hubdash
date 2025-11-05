"use client";

import { useState } from "react";
import Link from "next/link";

interface SyncResult {
  table: string;
  success: boolean;
  recordsSynced: number;
  errors: string[];
}

export default function AdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerSync = async () => {
    setSyncing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sync failed');
      }

      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-hti-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-hti-teal-light mt-1">
                Knack sync controls and system management
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg transition-colors text-sm font-medium"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Knack Sync Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-hti-navy mb-4">
            Knack → Supabase Sync
          </h2>
          <p className="text-gray-600 mb-6">
            Manually trigger a sync from Knack (source of truth) to Supabase (cache) to refresh dashboard data.
          </p>

          <button
            onClick={triggerSync}
            disabled={syncing}
            className="px-6 py-3 bg-hti-teal hover:bg-hti-teal-light disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {syncing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing...
              </>
            ) : (
              <>
                🔄 Trigger Full Sync
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-900">Sync Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Make sure KNACK_APP_ID and KNACK_API_KEY are set in .env.local
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Sync Results</h3>
              {results.map((result) => (
                <div
                  key={result.table}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{result.table}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {result.recordsSynced} records synced
                      </p>
                      {result.errors.length > 0 && (
                        <ul className="text-xs text-red-600 mt-2 space-y-1">
                          {result.errors.map((err, i) => (
                            <li key={i}>• {err}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-2xl">
                      {result.success ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* System Info */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-hti-navy mb-4">
            System Configuration
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Knack App ID</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_KNACK_APP_ID || process.env.KNACK_APP_ID ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Knack API Key</span>
              <span className="font-mono">
                {process.env.KNACK_API_KEY ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Supabase URL</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Supabase Key</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📚 Setup Instructions</h4>
            <p className="text-sm text-blue-700">
              To configure Knack integration, see{' '}
              <code className="bg-blue-100 px-1 rounded">KNACK_SETUP.md</code>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
