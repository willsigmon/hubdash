"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Partnership, FilterOptions, GroupingOption } from "@/types/partnership";
import ApplicationSearch from "@/components/marketing/ApplicationSearch";
import ApplicationFilters from "@/components/marketing/ApplicationFilters";
import ApplicationGrouping from "@/components/marketing/ApplicationGrouping";
import ApplicationDetailPanel from "@/components/marketing/ApplicationDetailPanel";
import { BarChart3, Users, CheckCircle, Clock, XCircle, Eye } from "lucide-react";

export default function MarketingPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Partnership | null>(null);
  const [groupBy, setGroupBy] = useState<GroupingOption['value']>('status');

  const [filters, setFilters] = useState<FilterOptions>({
    counties: [],
    statuses: [],
    chromebooksRange: { min: 0, max: 999999 },
    dateRange: { start: null, end: null },
    organizationTypes: [],
    firstTimeOnly: null,
    searchQuery: ''
  });

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetch('/api/partnerships?filter=all')
      .then(r => r.json())
      .then(data => {
        setPartnerships(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading partnerships:', error);
        setLoading(false);
      });
  }, []);

  // Extract available filter options
  const availableCounties = useMemo(() => {
    const counties = new Set<string>();
    partnerships.forEach(p => {
      if (p.county && p.county !== 'Unknown') {
        counties.add(p.county);
      }
    });
    return Array.from(counties);
  }, [partnerships]);

  const availableOrgTypes = useMemo(() => {
    const types = new Set<string>();
    partnerships.forEach(p => {
      if (p.organizationType) {
        types.add(p.organizationType);
      }
    });
    return Array.from(types);
  }, [partnerships]);

  // Apply filters and search
  const filteredApplications = useMemo(() => {
    return partnerships.filter(app => {
      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) {
        return false;
      }

      // County filter
      if (filters.counties.length > 0 && !filters.counties.includes(app.county)) {
        return false;
      }

      // Chromebooks range filter
      if (app.chromebooksNeeded < filters.chromebooksRange.min ||
          app.chromebooksNeeded > filters.chromebooksRange.max) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const appDate = new Date(app.timestamp);
        if (filters.dateRange.start && appDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && appDate > filters.dateRange.end) {
          return false;
        }
      }

      // Organization type filter
      if (filters.organizationTypes.length > 0 &&
          !filters.organizationTypes.includes(app.organizationType || '')) {
        return false;
      }

      // First-time filter
      if (filters.firstTimeOnly !== null && app.firstTime !== filters.firstTimeOnly) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableFields = [
          app.organizationName,
          app.contactPerson,
          app.county,
          app.email,
          app.howWillUse,
          app.positiveImpact,
          app.clientGoals,
          ...(app.workssWith || []),
          ...(app.clientStruggles || [])
        ].join(' ').toLowerCase();

        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [partnerships, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter(a => a.status === 'Pending').length;
    const approved = filteredApplications.filter(a => a.status === 'Approved').length;
    const inReview = filteredApplications.filter(a => a.status === 'In Review').length;
    const rejected = filteredApplications.filter(a => a.status === 'Rejected').length;
    const totalChromebooks = filteredApplications.reduce((sum, a) => sum + a.chromebooksNeeded, 0);

    return { total, pending, approved, inReview, rejected, totalChromebooks };
  }, [filteredApplications]);

  const handleAction = (action: string, applicationId: string) => {
    console.log(`Action: ${action} for application ${applicationId}`);
    // TODO: Implement action handlers
    switch (action) {
      case 'approve':
        alert(`Approve application ${applicationId}`);
        break;
      case 'request-info':
        alert(`Request more info for ${applicationId}`);
        break;
      case 'schedule':
        alert(`Schedule delivery for ${applicationId}`);
        break;
      case 'contact':
        alert(`Mark ${applicationId} as contacted`);
        break;
      case 'quote-card':
        alert(`Generate quote card for ${applicationId}`);
        break;
      case 'export':
        alert(`Export ${applicationId} to PDF`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/60 to-white">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Header */}
      <header
        className="relative overflow-hidden bg-gradient-to-r from-hti-navy via-hti-navy/95 to-hti-navy text-white shadow-xl"
        role="banner"
      >
        <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(circle_at_top_right,_rgba(255,213,128,0.35),_transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_bottom_left,_rgba(109,179,183,0.28),_transparent_65%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Marketing HUB</h1>
              <p className="text-hti-yellow text-lg">
                Partnership application management for HTI's marketing team
              </p>
            </div>
            <Link
              href="/"
              className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
              aria-label="Return to HUBDash home page"
            >
              ← Back to HUB
            </Link>
          </div>
        </div>
      </header>

      {/* Statistics Dashboard with Pizzazz */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">Application Pipeline</h2>
          <p className="text-hti-stone">Real-time overview of partnership applications</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              icon: <BarChart3 className="w-8 h-8 text-glass-bright" />,
              title: "Total Applications",
              value: stats.total,
              footer: "All statuses",
              glow: "from-hti-navy/45 to-hti-teal/30",
              textClass: "text-glass-bright",
            },
            {
              icon: <Clock className="w-8 h-8 text-hti-navy" />,
              title: "Pending Review",
              value: stats.pending,
              footer: stats.pending > 0 ? "Action needed" : "All reviewed",
              glow: "from-hti-yellow/45 to-hti-orange/30",
              textClass: "text-hti-navy",
            },
            {
              icon: <Eye className="w-8 h-8 text-glass-bright" />,
              title: "Under Review",
              value: stats.inReview,
              footer: "Being evaluated",
              glow: "from-hti-navy/40 to-hti-teal/30",
              textClass: "text-glass-bright",
            },
            {
              icon: <CheckCircle className="w-8 h-8 text-glass-bright" />,
              title: "Approved",
              value: stats.approved,
              footer: "Ready to deliver",
              glow: "from-hti-orange/45 to-hti-yellow/30",
              textClass: "text-glass-bright",
            },
            {
              icon: <XCircle className="w-8 h-8 text-glass-bright" />,
              title: "Rejected",
              value: stats.rejected,
              footer: "Ineligible",
              glow: "from-hti-orange/40 to-hti-red/30",
              textClass: "text-glass-bright",
            },
            {
              icon: <Users className="w-8 h-8 text-glass-bright" />,
              title: "Chromebooks Needed",
              value: stats.totalChromebooks,
              footer: "Total requested",
              glow: "from-hti-teal/40 to-hti-navy/35",
              textClass: "text-glass-bright",
            },
          ].map(({ icon, title, value, footer, glow, textClass }, index) => (
            <div
              key={index}
              className={`glass-card glass-card--subtle shadow-glass p-6 hover:-translate-y-1 transition-transform duration-300 relative group ${textClass}`}
            >
              <div className={`glass-card__glow bg-gradient-to-br ${glow}`} />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  {icon}
              </div>
                <div className="text-sm font-medium text-glass-muted">{title}</div>
                <div className="text-4xl font-bold text-glass-bright">{value}</div>
                <div className="text-xs text-glass-muted/80">{footer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" role="main">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">Browse Applications</h2>
          <p className="text-gray-700">Use filters and search to find applications. Click any card to view full details.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div className="glass-card glass-card--subtle shadow-glass p-6">
                <div className="glass-card__glow bg-gradient-to-br from-hti-teal/30 to-hti-navy/25" />
                <h3 className="relative z-10 text-lg font-bold text-glass-bright mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-hti-teal rounded-full" />
                  Filter applications
                </h3>
                <ApplicationFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCounties={availableCounties}
                  availableOrgTypes={availableOrgTypes}
                />
              </div>
            </div>
          </aside>

          {/* Main Content - Search and Applications */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <ApplicationSearch
              searchQuery={filters.searchQuery}
              onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
              resultCount={filteredApplications.length}
              totalCount={partnerships.length}
            />

            {/* Loading State */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card glass-card--subtle shadow-glass h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              /* Applications Grid/List */
              <ApplicationGrouping
                applications={filteredApplications}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                onApplicationClick={setSelectedApplication}
              />
            )}
          </div>
        </div>
      </main>

      {/* Detail Panel Modal */}
      {selectedApplication && (
        <ApplicationDetailPanel
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
