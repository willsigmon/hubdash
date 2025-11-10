"use client";

import React from "react";

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  section: string; // human-readable section label for logging
  fallback?: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * SectionErrorBoundary
 * Granular error boundary to isolate failures within individual Ops dashboard sections.
 * Prevents a single component crash from blanking the entire dashboard while enabling
 * targeted diagnostics (section name + error message surfaced in development).
 */
export default class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[SectionErrorBoundary] '${this.props.section}' crashed:`, error, info);
  }

  handleRetry = () => {
    // Reset state to attempt re-render; useful for transient issues
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="bg-surface-alt border border-danger rounded-xl p-6 text-center space-y-3">
          <h4 className="text-lg font-bold text-danger">{this.props.section} failed to load</h4>
          <p className="text-sm text-secondary">A problem occurred rendering this section. Other sections continue to function.</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 accent-gradient text-on-accent font-semibold rounded-lg shadow hover:shadow-md transition-all text-sm"
          >
            Retry Section ↻
          </button>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <pre className="mt-4 text-left text-xs text-muted whitespace-pre-wrap bg-surface rounded p-3 overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
