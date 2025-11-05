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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-hti-navy to-hti-teal text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Marketing Hub</h1>
              <p className="text-white/90 text-lg">
                Partnership application management for HTI's marketing team
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Statistics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-hti-navy" />
              <div className="text-xs font-medium text-gray-600">Total</div>
            </div>
            <div className="text-2xl font-bold text-hti-navy">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div className="text-xs font-medium text-gray-600">Pending</div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <div className="text-xs font-medium text-gray-600">In Review</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-xs font-medium text-gray-600">Approved</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="text-xs font-medium text-gray-600">Rejected</div>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-hti-teal" />
              <div className="text-xs font-medium text-gray-600">Chromebooks</div>
            </div>
            <div className="text-2xl font-bold text-hti-teal">{stats.totalChromebooks}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-6 space-y-6">
              <ApplicationFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCounties={availableCounties}
                availableOrgTypes={availableOrgTypes}
              />
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
