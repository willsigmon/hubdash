"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface KnackStatus {
    configured: boolean;
    endpoints: {
        name: string;
        status: 'ok' | 'error' | 'unconfigured';
        message?: string;
    }[];
}

export default function KnackStatusBanner() {
    const [status, setStatus] = useState<KnackStatus | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function checkKnackStatus() {
            try {
                // Test multiple endpoints to see which are working
                const endpoints = [
                    { name: 'Metrics', url: '/api/metrics' },
                    { name: 'Devices', url: '/api/devices?page=1&limit=1' },
                    { name: 'Partnerships', url: '/api/partnerships?filter=all' },
                ];

                const results = await Promise.all(
                    endpoints.map(async (endpoint) => {
                        try {
                            const res = await fetch(endpoint.url);
                            const data = await res.json();

                            if (res.status === 503) {
                                return {
                                    name: endpoint.name,
                                    status: 'unconfigured' as const,
                                    message: data.error || 'Not configured',
                                };
                            }

                            if (!res.ok) {
                                return {
                                    name: endpoint.name,
                                    status: 'error' as const,
                                    message: data.error || `HTTP ${res.status}`,
                                };
                            }

                            return {
                                name: endpoint.name,
                                status: 'ok' as const,
                            };
                        } catch (error) {
                            return {
                                name: endpoint.name,
                                status: 'error' as const,
                                message: error instanceof Error ? error.message : 'Network error',
                            };
                        }
                    })
                );

                const allConfigured = results.every(r => r.status === 'ok');
                const anyUnconfigured = results.some(r => r.status === 'unconfigured');

                setStatus({
                    configured: allConfigured,
                    endpoints: results,
                });

                // Auto-dismiss if everything is working
                if (allConfigured) {
                    setTimeout(() => setDismissed(true), 3000);
                }
            } catch (error) {
                console.error('Error checking Knack status:', error);
            } finally {
                setChecking(false);
            }
        }

        checkKnackStatus();
    }, []);

    if (checking || dismissed || !status) {
        return null;
    }

    // Don't show if everything is working
    if (status.configured) {
        return null;
    }

    const unconfigured = status.endpoints.filter(e => e.status === 'unconfigured');
    const errors = status.endpoints.filter(e => e.status === 'error');

    return (
        <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card glass-card--subtle shadow-2xl border-2 border-hti-yellow/60 p-4 md:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {unconfigured.length > 0 ? (
                                <AlertCircle className="w-6 h-6 text-hti-yellow" />
                            ) : (
                                <XCircle className="w-6 h-6 text-hti-red" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-glass-bright mb-2">
                                {unconfigured.length > 0 ? '⚙️ Knack Integration Setup Required' : '❌ Knack Connection Issues'}
                            </h3>

                            {unconfigured.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm text-glass-muted">
                                        HubDash needs Knack credentials to display live data from your HEARTS database.
                                    </p>

                                    <div className="bg-hti-navy/10 rounded-lg p-4 space-y-2">
                                        <p className="text-sm font-semibold text-glass-bright">Quick Setup:</p>
                                        <ol className="text-sm text-glass-muted space-y-1 list-decimal list-inside">
                                            <li>Run: <code className="bg-hti-navy/20 px-2 py-0.5 rounded text-hti-teal">npm run setup-knack</code></li>
                                            <li>Enter your Knack credentials from Builder → Settings → API & Code</li>
                                            <li>Restart dev server: <code className="bg-hti-navy/20 px-2 py-0.5 rounded text-hti-teal">npm run dev</code></li>
                                        </ol>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <a
                                            href="https://builder.knack.com/hearts"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-button glass-button--accent text-xs flex items-center gap-1"
                                        >
                                            Open Knack Builder <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <button
                                            onClick={() => setDismissed(true)}
                                            className="glass-button text-xs"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            )}

                            {errors.length > 0 && unconfigured.length === 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm text-glass-muted">
                                        Some Knack endpoints are returning errors:
                                    </p>

                                    <div className="space-y-2">
                                        {errors.map(endpoint => (
                                            <div key={endpoint.name} className="flex items-start gap-2 text-sm">
                                                <XCircle className="w-4 h-4 text-hti-red flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-semibold text-glass-bright">{endpoint.name}:</span>
                                                    <span className="text-glass-muted ml-2">{endpoint.message}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-hti-navy/10 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-glass-bright mb-2">Debug Steps:</p>
                                        <ol className="text-sm text-glass-muted space-y-1 list-decimal list-inside">
                                            <li>Run: <code className="bg-hti-navy/20 px-2 py-0.5 rounded text-hti-teal">npm run test-knack</code></li>
                                            <li>Check object keys in .env.local match Knack Builder</li>
                                            <li>Verify API key has read permissions</li>
                                            <li>Check server console for detailed error logs</li>
                                        </ol>
                                    </div>

                                    <button
                                        onClick={() => setDismissed(true)}
                                        className="glass-button text-xs"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status indicators for each endpoint */}
                    <div className="mt-4 pt-4 border-t glass-divider">
                        <div className="flex flex-wrap gap-2">
                            {status.endpoints.map(endpoint => (
                                <div
                                    key={endpoint.name}
                                    className={`glass-chip text-xs flex items-center gap-1 ${endpoint.status === 'ok'
                                            ? 'glass-chip--teal'
                                            : endpoint.status === 'unconfigured'
                                                ? 'glass-chip--slate'
                                                : 'glass-chip--red'
                                        }`}
                                >
                                    {endpoint.status === 'ok' && <CheckCircle className="w-3 h-3" />}
                                    {endpoint.status === 'unconfigured' && <AlertCircle className="w-3 h-3" />}
                                    {endpoint.status === 'error' && <XCircle className="w-3 h-3" />}
                                    {endpoint.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
