"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Partnership, FilterOptions, GroupingOption } from "@/types/partnership";
import ApplicationSearch from "@/components/marketing/ApplicationSearch";
import ApplicationFilters from "@/components/marketing/ApplicationFilters";
import ApplicationGrouping from "@/components/marketing/ApplicationGrouping";
import ApplicationDetailPanel from "@/components/marketing/ApplicationDetailPanel";
import { BarChart3, Users, CheckCircle, Clock, XCircle, Eye, Zap, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy to-hti-teal text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Marketing HUB</h1>
              <p className="text-white/90 text-lg">
                Partnership application management for HTI's marketing team
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
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
          <p className="text-gray-700">Real-time overview of partnership applications</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Card */}
          <div className="group bg-gradient-to-br from-hti-navy to-hti-navy/80 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-white/80" />
                <Zap className="w-4 h-4 text-hti-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Total Applications</div>
              <div className="text-4xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-white/60 mt-2">All statuses</div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="group bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-4 h-4 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Pending Review</div>
              <div className="text-4xl font-bold text-white">{stats.pending}</div>
              <div className="text-xs text-white/60 mt-2">{stats.pending > 0 ? 'Action needed' : 'All reviewed'}</div>
            </div>
          </div>

          {/* In Review Card */}
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Under Review</div>
              <div className="text-4xl font-bold text-white">{stats.inReview}</div>
              <div className="text-xs text-white/60 mt-2">Being evaluated</div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Approved</div>
              <div className="text-4xl font-bold text-white">{stats.approved}</div>
              <div className="text-xs text-white/60 mt-2">Ready to deliver</div>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="group bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Rejected</div>
              <div className="text-4xl font-bold text-white">{stats.rejected}</div>
              <div className="text-xs text-white/60 mt-2">Ineligible</div>
            </div>
          </div>

          {/* Chromebooks Card */}
          <div className="group bg-gradient-to-br from-hti-teal to-hti-teal-light rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">Chromebooks Needed</div>
              <div className="text-4xl font-bold text-white">{stats.totalChromebooks}</div>
              <div className="text-xs text-white/60 mt-2">Total requested</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-hti-navy mb-2">Browse Applications</h2>
          <p className="text-gray-700">Use filters and search to find applications. Click any card to view full details.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-hti-teal">
                <h3 className="text-lg font-bold text-hti-navy mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-hti-teal rounded-full" />
                  Filter Applications
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
                  <div key={i} className="bg-white rounded-xl h-64 animate-pulse shadow-lg" />
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
