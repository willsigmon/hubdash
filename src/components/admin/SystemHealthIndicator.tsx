"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
  knackConnected: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'success' | 'failed' | 'partial' | null;
  appId: string;
}

export function SystemHealthIndicator() {
  const [health, setHealth] = useState<HealthStatus>({
    knackConnected: false,
    lastSyncTime: null,
    lastSyncStatus: null,
    appId: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      // Check Knack connection
      const knackAppId = process.env.NEXT_PUBLIC_KNACK_APP_ID || '';
      const knackApiKey = typeof window !== 'undefined' ? 'configured' : '';

      // Get last sync info from localStorage or API
      const lastSync = localStorage.getItem('lastSyncTime');
      const lastSyncStatus = localStorage.getItem('lastSyncStatus') as 'success' | 'failed' | 'partial' | null;

      setHealth({
        knackConnected: !!knackAppId && !!knackApiKey,
        lastSyncTime: lastSync,
        lastSyncStatus,
        appId: knackAppId,
      });
    } catch (error) {
      console.error('Health check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'partial':
        return '⚠️';
      default:
        return '⏳';
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Knack Connection */}
      <div className={`rounded-lg shadow p-4 border-2 ${health.knackConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Knack Connection</h3>
            <p className={`text-lg font-bold mt-1 ${health.knackConnected ? 'text-green-700' : 'text-red-700'}`}>
              {health.knackConnected ? 'Connected' : 'Disconnected'}
            </p>
            {health.appId && (
              <p className="text-xs text-gray-600 mt-2 font-mono">
                App ID: {health.appId.substring(0, 8)}...
              </p>
            )}
          </div>
          <span className="text-4xl">
            {health.knackConnected ? '🔗' : '🔌'}
          </span>
        </div>
      </div>

      {/* Last Sync */}
      <div className={`rounded-lg shadow p-4 border-2 ${getStatusColor(health.lastSyncStatus)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Last Sync</h3>
            <p className="text-lg font-bold mt-1 text-gray-900">
              {formatTime(health.lastSyncTime)}
            </p>
            {health.lastSyncStatus && (
              <p className={`text-xs font-medium mt-2 capitalize ${
                health.lastSyncStatus === 'success' ? 'text-green-700' :
                health.lastSyncStatus === 'partial' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                Status: {health.lastSyncStatus}
              </p>
            )}
          </div>
          <span className="text-4xl">
            {getStatusIcon(health.lastSyncStatus)}
          </span>
        </div>
      </div>
    </div>
  );
}
