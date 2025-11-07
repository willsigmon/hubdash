/**
 * Analytics Engine
 * Comprehensive business intelligence and usage analytics system
 */

import { create } from 'zustand';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  userId?: string;
  sessionId: string;
  page: string;
  action: string;
  data?: Record<string, any>;
  userAgent: string;
  referrer?: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pages: string[];
  events: number;
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    os: string;
    browser: string;
  };
  location?: {
    country: string;
    region: string;
  };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface BusinessMetrics {
  totalDevices: number;
  devicesDistributed: number;
  activeUsers: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number; avgTime: number }>;
  userFlow: Array<{ from: string; to: string; count: number }>;
}

interface AnalyticsState {
  // Event tracking
  events: AnalyticsEvent[];
  sessions: UserSession[];

  // Real-time metrics
  activeUsers: number;
  currentSession: UserSession | null;

  // Performance tracking
  performanceMetrics: PerformanceMetrics[];

  // Business intelligence
  businessMetrics: BusinessMetrics | null;

  // Actions
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => void;
  startSession: (session: Omit<UserSession, 'id' | 'startTime' | 'events'>) => void;
  endSession: () => void;
  trackPerformance: (metrics: PerformanceMetrics) => void;
  updateBusinessMetrics: (metrics: BusinessMetrics) => void;
  getEventsByDateRange: (start: Date, end: Date) => AnalyticsEvent[];
  getSessionAnalytics: () => {
    totalSessions: number;
    avgDuration: number;
    bounceRate: number;
    deviceBreakdown: Record<string, number>;
  };
  getUserFlow: () => Array<{ from: string; to: string; count: number }>;
  exportAnalytics: () => string;
}

// Analytics store
export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  events: [],
  sessions: [],
  activeUsers: 0,
  currentSession: null,
  performanceMetrics: [],
  businessMetrics: null,

  trackEvent: (eventData) => {
    const event: AnalyticsEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: get().currentSession?.id || 'unknown',
    };

    set((state) => ({
      events: [...state.events, event].slice(-10000), // Keep last 10k events
    }));

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      sendToAnalyticsService(event);
    }
  },

  startSession: (sessionData) => {
    const session: UserSession = {
      ...sessionData,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      events: 0,
      pages: [],
    };

    set((state) => ({
      currentSession: session,
      sessions: [...state.sessions, session],
      activeUsers: state.activeUsers + 1,
    }));
  },

  endSession: () => {
    const { currentSession } = get();
    if (currentSession) {
      const endTime = new Date();
      const duration = endTime.getTime() - currentSession.startTime.getTime();

      set((state) => ({
        currentSession: null,
        activeUsers: Math.max(0, state.activeUsers - 1),
        sessions: state.sessions.map(s =>
          s.id === currentSession.id
            ? { ...s, endTime, duration }
            : s
        ),
      }));
    }
  },

  trackPerformance: (metrics) => {
    set((state) => ({
      performanceMetrics: [...state.performanceMetrics, metrics].slice(-1000),
    }));
  },

  updateBusinessMetrics: (metrics) => {
    set({ businessMetrics: metrics });
  },

  getEventsByDateRange: (start, end) => {
    return get().events.filter(
      event => event.timestamp >= start && event.timestamp <= end
    );
  },

  getSessionAnalytics: () => {
    const { sessions } = get();

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.endTime);
    const avgDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length
      : 0;

    const bouncedSessions = sessions.filter(s => s.pages.length === 1).length;
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    const deviceBreakdown = sessions.reduce((acc, session) => {
      const device = session.device.type;
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions,
      avgDuration,
      bounceRate,
      deviceBreakdown,
    };
  },

  getUserFlow: () => {
    const { events } = get();

    const pageViews = events.filter(e => e.action === 'page_view');
    const flows: Array<{ from: string; to: string; count: number }> = [];

    // Group by user/session and create flow sequences
    const userFlows = new Map<string, string[]>();

    pageViews.forEach(event => {
      const key = event.userId || event.sessionId;
      if (!userFlows.has(key)) {
        userFlows.set(key, []);
      }
      userFlows.get(key)!.push(event.page);
    });

    // Count transitions
    userFlows.forEach(pages => {
      for (let i = 0; i < pages.length - 1; i++) {
        const from = pages[i];
        const to = pages[i + 1];

        const existing = flows.find(f => f.from === from && f.to === to);
        if (existing) {
          existing.count++;
        } else {
          flows.push({ from, to, count: 1 });
        }
      }
    });

    return flows.sort((a, b) => b.count - a.count);
  },

  exportAnalytics: () => {
    const { events, sessions, performanceMetrics, businessMetrics } = get();
    return JSON.stringify({
      events,
      sessions,
      performanceMetrics,
      businessMetrics,
      exportDate: new Date().toISOString(),
    }, null, 2);
  },
}));

/**
 * Analytics tracking utilities
 */
export class AnalyticsTracker {
  static trackPageView(page: string, data?: Record<string, any>) {
    const { trackEvent } = useAnalyticsStore.getState();
    trackEvent({
      eventType: 'page_view',
      page,
      action: 'view',
      data,
      userAgent: navigator.userAgent,
    });
  }

  static trackUserAction(action: string, data?: Record<string, any>) {
    const { trackEvent } = useAnalyticsStore.getState();
    trackEvent({
      eventType: 'user_action',
      page: window.location.pathname,
      action,
      data,
      userAgent: navigator.userAgent,
    });
  }

  static trackError(error: Error, context?: Record<string, any>) {
    const { trackEvent } = useAnalyticsStore.getState();
    trackEvent({
      eventType: 'error',
      page: window.location.pathname,
      action: 'error_occurred',
      data: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
      userAgent: navigator.userAgent,
    });
  }

  static trackPerformance(metrics: PerformanceMetrics) {
    const { trackPerformance } = useAnalyticsStore.getState();
    trackPerformance(metrics);
  }
}

/**
 * Predictive Analytics Engine
 */
export class PredictiveAnalytics {
  static predictDonationPatterns(historicalData: any[]): {
    nextMonthPrediction: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    // Simple linear regression for demonstration
    // In production, you'd use more sophisticated ML models

    if (historicalData.length < 3) {
      return {
        nextMonthPrediction: 0,
        confidence: 0,
        trend: 'stable',
      };
    }

    const values = historicalData.map(d => d.value);
    const n = values.length;

    // Calculate trend
    const recent = values.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgOverall = values.reduce((a, b) => a + b, 0) / n;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (avgRecent > avgOverall * 1.1) trend = 'increasing';
    if (avgRecent < avgOverall * 0.9) trend = 'decreasing';

    // Simple linear prediction
    const prediction = avgRecent * 1.05; // 5% growth assumption
    const confidence = Math.min(0.8, n / 12); // Higher confidence with more data

    return {
      nextMonthPrediction: Math.round(prediction),
      confidence,
      trend,
    };
  }

  static forecastDeviceNeeds(
    currentDevices: number,
    distributionRate: number,
    months: number = 6
  ): Array<{ month: string; predicted: number; confidence: number }> {
    const forecast = [];
    let current = currentDevices;

    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);

      // Assume 10% monthly growth with some seasonality
      const seasonalFactor = 1 + 0.1 * Math.sin((i * Math.PI) / 6); // Seasonal variation
      current = Math.round(current * (1 + distributionRate) * seasonalFactor);

      forecast.push({
        month: format(date, 'MMM yyyy'),
        predicted: current,
        confidence: Math.max(0.3, 1 - (i * 0.1)), // Confidence decreases over time
      });
    }

    return forecast;
  }
}

/**
 * Business Intelligence Dashboard Data
 */
export class BusinessIntelligence {
  static calculateKPIs(data: any): BusinessMetrics {
    const totalDevices = data.devices?.length || 0;
    const devicesDistributed = data.devices?.filter((d: any) => d.status === 'distributed').length || 0;

    // Mock calculations - in real app, these would be computed from actual data
    const activeUsers = Math.floor(Math.random() * 50) + 10;
    const conversionRate = 0.75;
    const avgSessionDuration = 180; // seconds
    const bounceRate = 0.25;

    const topPages = [
      { page: '/board', views: 1250, avgTime: 180 },
      { page: '/ops', views: 890, avgTime: 240 },
      { page: '/reports', views: 650, avgTime: 150 },
      { page: '/marketing', views: 420, avgTime: 120 },
    ];

    const userFlow = [
      { from: '/', to: '/board', count: 450 },
      { from: '/board', to: '/ops', count: 320 },
      { from: '/ops', to: '/reports', count: 180 },
      { from: '/', to: '/marketing', count: 150 },
    ];

    return {
      totalDevices,
      devicesDistributed,
      activeUsers,
      conversionRate,
      avgSessionDuration,
      bounceRate,
      topPages,
      userFlow,
    };
  }

  static generateInsights(metrics: BusinessMetrics): string[] {
    const insights = [];

    if (metrics.conversionRate > 0.8) {
      insights.push('Excellent conversion rate - user experience is working well');
    }

    if (metrics.bounceRate < 0.2) {
      insights.push('Low bounce rate indicates engaging content');
    }

    if (metrics.avgSessionDuration > 300) {
      insights.push('Users are spending significant time on the platform');
    }

    const topPage = metrics.topPages[0];
    if (topPage) {
      insights.push(`${topPage.page} is the most popular page with ${topPage.views} views`);
    }

    return insights;
  }
}

/**
 * Privacy-compliant analytics initialization
 */
export function initializeAnalytics(userConsent: boolean = false) {
  if (typeof window === 'undefined') return;

  // Only initialize if user has consented
  if (!userConsent && !localStorage.getItem('analytics-consent')) {
    return;
  }

  // Start session tracking
  const { startSession } = useAnalyticsStore.getState();

  const deviceType = window.innerWidth < 768 ? 'mobile' :
                    window.innerWidth < 1024 ? 'tablet' : 'desktop';

  startSession({
    pages: [window.location.pathname],
    device: {
      type: deviceType,
      os: navigator.platform,
      browser: navigator.userAgent.split(' ')[0],
    },
  });

  // Track initial page view
  AnalyticsTracker.trackPageView(window.location.pathname);

  // Track performance on page load
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = (window as any).performance.getEntriesByType('navigation')[0];
        const paintEntries = (window as any).performance.getEntriesByType('paint');

        const fcp = paintEntries.find((entry: any) => entry.name === 'first-contentful-paint');
        const lcp = (window as any).performance.getEntriesByType('largest-contentful-paint')[0];

        AnalyticsTracker.trackPerformance({
          pageLoadTime: perfData.loadEventEnd - perfData.fetchStart,
          timeToInteractive: perfData.domInteractive - perfData.fetchStart,
          firstContentfulPaint: fcp?.startTime || 0,
          largestContentfulPaint: lcp?.startTime || 0,
          cumulativeLayoutShift: 0, // Would need additional tracking
          firstInputDelay: 0, // Would need interaction tracking
        });
      }, 0);
    });
  }
}

// Send to external analytics service (placeholder)
function sendToAnalyticsService(event: AnalyticsEvent) {
  // In production, send to services like Google Analytics, Mixpanel, etc.
  console.log('Analytics event:', event);
}
