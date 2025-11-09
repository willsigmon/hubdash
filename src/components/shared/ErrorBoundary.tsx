"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; could be wired to Sentry/etc.
    console.error("Ops ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] bg-surface rounded-xl border border-default p-6 text-center">
          <h3 className="text-xl font-bold text-primary mb-2">Something went wrong</h3>
          <p className="text-secondary mb-4">Please refresh the page. If the issue persists, contact support.</p>
          <button
            className="px-4 py-2 accent-gradient text-white rounded-lg font-semibold"
            onClick={() => (window.location.href = window.location.href)}
          >
            Refresh
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <pre className="mt-4 text-left text-xs text-muted whitespace-pre-wrap bg-surface-alt rounded p-3 overflow-auto max-h-48">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
