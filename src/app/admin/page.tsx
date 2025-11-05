"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SystemHealthIndicator,
  SyncHistoryTable,
  ObjectDiscovery,
  TableSyncControls,
  ExportControls,
} from "@/components/admin";

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

  const triggerFullSync = async () => {
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
      // Save to localStorage for health indicator
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      localStorage.setItem('lastSyncStatus', 'success');
    } catch (err: any) {
      setError(err.message);
      localStorage.setItem('lastSyncStatus', 'failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy to-hti-navy/90 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-hti-teal-light mt-2 text-lg">
                Advanced controls & system management
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-hti-teal hover:bg-hti-teal-light rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Health Section */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-hti-navy mb-4 flex items-center gap-2">
            💚 System Health
          </h2>
          <SystemHealthIndicator />
        </section>

        {/* Full Sync Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-teal">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">
            🔄 Full System Sync
          </h2>
          <p className="text-gray-600 mb-6">
            Manually trigger a complete sync from Knack (source of truth) to Supabase (cache) to refresh all dashboard data.
          </p>

          <button
            onClick={triggerFullSync}
            disabled={syncing}
            className="px-8 py-4 bg-gradient-to-r from-hti-teal to-hti-teal-light hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none text-white rounded-lg font-bold transition-all transform hover:scale-105 disabled:scale-100 flex items-center gap-3 text-lg"
          >
            {syncing ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing All Tables...
              </>
            ) : (
              <>
                🚀 Trigger Full Sync
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-900">Sync Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Make sure KNACK_APP_ID and KNACK_API_KEY are configured in your environment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="mt-8 space-y-4 animate-slide-up">
              <h3 className="font-semibold text-hti-navy text-lg">Sync Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.map((result) => (
                  <div
                    key={result.table}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-hti-navy capitalize">
                          {result.table}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.recordsSynced} records synced
                        </p>
                      </div>
                      <span className="text-3xl">
                        {result.success ? '✅' : '❌'}
                      </span>
                    </div>
                    {result.errors.length > 0 && (
                      <ul className="text-xs text-red-600 space-y-1 border-t pt-3">
                        {result.errors.map((err, i) => (
                          <li key={i}>• {err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Individual Table Sync Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-navy">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">
            📦 Individual Table Sync
          </h2>
          <p className="text-gray-600 mb-6">
            Sync individual tables independently for targeted updates.
          </p>
          <TableSyncControls />
        </section>

        {/* Object Discovery Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-teal-light">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">
            🔍 Knack Object Discovery
          </h2>
          <p className="text-gray-600 mb-6">
            Discover Knack objects and auto-generate field mappings for new integrations.
          </p>
          <ObjectDiscovery />
        </section>

        {/* Sync History Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-navy">
          <h2 className="text-2xl font-bold text-hti-navy mb-4 flex items-center gap-2">
            📋 Sync History (Last 10)
          </h2>
          <SyncHistoryTable />
        </section>

        {/* Export Controls Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-teal">
          <h2 className="text-2xl font-bold text-hti-navy mb-4 flex items-center gap-2">
            📥 Export & Backup
          </h2>
          <ExportControls />
        </section>

        {/* System Configuration Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-gray-300">
          <h2 className="text-2xl font-bold text-hti-navy mb-4">
            ⚙️ System Configuration
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-3 px-4 bg-gray-50 rounded border border-gray-200 hover:border-hti-teal transition-colors">
              <span className="font-medium text-gray-700">Knack App ID</span>
              <span className="font-mono font-bold text-hti-navy">
                {process.env.NEXT_PUBLIC_KNACK_APP_ID ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between py-3 px-4 bg-gray-50 rounded border border-gray-200 hover:border-hti-teal transition-colors">
              <span className="font-medium text-gray-700">Knack API Key</span>
              <span className="font-mono font-bold text-hti-navy">
                {/* Note: API keys are server-side only and cannot be checked from client */}
                ✅ Configured (server-side)
              </span>
            </div>
            <div className="flex justify-between py-3 px-4 bg-gray-50 rounded border border-gray-200 hover:border-hti-teal transition-colors">
              <span className="font-medium text-gray-700">Supabase URL</span>
              <span className="font-mono font-bold text-hti-navy">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between py-3 px-4 bg-gray-50 rounded border border-gray-200 hover:border-hti-teal transition-colors">
              <span className="font-medium text-gray-700">Supabase API Key</span>
              <span className="font-mono font-bold text-hti-navy">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Not Set'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📚 Setup & Documentation</h4>
            <p className="text-sm text-blue-700 mb-2">
              To configure Knack integration and view detailed setup instructions, please see:
            </p>
            <code className="block bg-blue-100 px-3 py-2 rounded text-xs text-blue-900 font-mono">
              KNACK_SETUP.md
            </code>
          </div>
        </section>

        {/* Quick Links Footer */}
        <section className="bg-gradient-to-r from-hti-navy to-hti-navy/90 rounded-xl shadow-lg p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Need Help?</h3>
          <p className="text-hti-teal-light mb-4">
            Refer to the documentation or contact the development team for assistance.
          </p>
          <a
            href="https://hubzonetech.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg transition-colors font-medium"
          >
            📖 HTI Website
          </a>
        </section>
      </main>
    </div>
  );
}
