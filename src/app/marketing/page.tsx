"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Partnership, FilterOptions, GroupingOption } from "@/types/partnership";
import ApplicationSearch from "@/components/marketing/ApplicationSearch";
import ApplicationFilters from "@/components/marketing/ApplicationFilters";
import ApplicationGrouping from "@/components/marketing/ApplicationGrouping";
import ApplicationDetailPanel from "@/components/marketing/ApplicationDetailPanel";
import { BarChart3, Users, CheckCircle, Clock, XCircle, Eye, TrendingUp, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataExporter, type ReportConfig } from "@/lib/export/report-generator";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/layout/PageHero";
import PageSectionHeading from "@/components/layout/PageSectionHeading";

async function updatePartnershipStatus(id: string, status: string, notes?: string) {
  const res = await fetch(`/api/partnerships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error('Failed to update partnership');
  return res.json();
}

export default function MarketingPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Partnership | null>(null);
  const [groupBy, setGroupBy] = useState<GroupingOption['value']>('status');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      updatePartnershipStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerships'] });
      // Refresh partnerships list
      fetch('/api/partnerships?filter=all')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPartnerships(data);
            setErrorMessage(null);
          } else {
            setPartnerships([]);
            setErrorMessage(typeof data?.error === 'string' ? data.error : 'Unexpected response from partnerships API.');
          }
        })
        .catch(err => {
          console.error('Error refreshing partnerships:', err);
          setErrorMessage(err instanceof Error ? err.message : 'Unable to refresh partnerships right now.');
        });
    },
  });

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
        if (Array.isArray(data)) {
          setPartnerships(data);
          setErrorMessage(null);
        } else {
          setPartnerships([]);
          setErrorMessage(typeof data?.error === 'string' ? data.error : 'Unexpected response from partnerships API.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading partnerships:', error);
        setPartnerships([]);
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load partnerships right now.');
        setLoading(false);
      });
  }, []);

  // Extract available filter options
  const availableCounties = useMemo(() => {
    const counties = new Set<string>();
    (Array.isArray(partnerships) ? partnerships : []).forEach(p => {
      if (p?.county && p.county !== 'Unknown') {
        counties.add(p.county);
      }
    });
    return Array.from(counties);
  }, [partnerships]);

  const availableOrgTypes = useMemo(() => {
    const types = new Set<string>();
    (Array.isArray(partnerships) ? partnerships : []).forEach(p => {
      if (p?.organizationType) {
        types.add(p.organizationType);
      }
    });
    return Array.from(types);
  }, [partnerships]);

  // Apply filters and search
  const filteredApplications = useMemo(() => {
    if (!Array.isArray(partnerships)) return [];

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

  const handleAction = async (action: string, applicationId: string) => {
    const application = partnerships.find(p => p.id === applicationId);
    if (!application) return;

    setActionLoading(action);

    try {
      switch (action) {
        case 'approve':
          await updateMutation.mutateAsync({
            id: applicationId,
            status: 'Approved',
            notes: `Approved on ${new Date().toLocaleDateString()}`,
          });
          setSelectedApplication({ ...application, status: 'Approved' });
          break;

        case 'request-info':
          await updateMutation.mutateAsync({
            id: applicationId,
            status: 'In Review',
            notes: `Requested additional information on ${new Date().toLocaleDateString()}`,
          });
          setSelectedApplication({ ...application, status: 'In Review' });
          break;

        case 'schedule':
          await updateMutation.mutateAsync({
            id: applicationId,
            status: 'Approved',
            notes: `Scheduled for delivery on ${new Date().toLocaleDateString()}`,
          });
          alert(`Delivery scheduled for ${application.organizationName}. Update delivery date in Knack.`);
          break;

        case 'contact':
          await updateMutation.mutateAsync({
            id: applicationId,
            status: application.status,
            notes: `Contacted on ${new Date().toLocaleDateString()}`,
          });
          break;

        case 'quote-card':
          if (application.quote) {
            const quoteConfig: ReportConfig = {
              title: 'HTI Impact Quote',
              subtitle: application.organizationName,
              branding: {
                primaryColor: '#4a9b9f',
                secondaryColor: '#1e3a5f',
              },
              sections: [
                {
                  title: 'Quote',
                  type: 'text',
                  data: `"${application.quote}"\n\n— ${application.contactPerson}, ${application.organizationName}`,
                },
                {
                  title: 'Impact Details',
                  type: 'metrics',
                  data: [
                    { label: 'Chromebooks Needed', value: application.chromebooksNeeded },
                    { label: 'County', value: application.county || 'Unknown' },
                    { label: 'Organization Type', value: application.organizationType || 'N/A' },
                  ],
                },
              ],
            };
            const filename = `HTI-Quote-${application.organizationName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
            await DataExporter.exportToPDF(quoteConfig, filename);
          } else {
            alert('No quote available for this application.');
          }
          break;

        case 'export':
          const exportConfig: ReportConfig = {
            title: 'Partnership Application',
            subtitle: application.organizationName,
            branding: {
              primaryColor: '#4a9b9f',
              secondaryColor: '#1e3a5f',
            },
            sections: [
              {
                title: 'Organization Information',
                type: 'table',
                data: {
                  headers: ['Field', 'Value'],
                  rows: [
                    ['Organization Name', application.organizationName],
                    ['Contact Person', application.contactPerson],
                    ['Email', application.email || 'N/A'],
                    ['Phone', application.phone || 'N/A'],
                    ['County', application.county || 'Unknown'],
                    ['501(c)(3) Status', application.is501c3 ? 'Yes' : 'No'],
                    ['Chromebooks Needed', String(application.chromebooksNeeded)],
                    ['Status', application.status],
                    ['Submitted', new Date(application.timestamp).toLocaleDateString()],
                  ],
                },
              },
              {
                title: 'Application Details',
                type: 'text',
                data: `How they'll use Chromebooks: ${application.howWillUse || 'N/A'}\n\nExpected Impact: ${application.positiveImpact || 'N/A'}\n\n${application.quote ? `Quote: "${application.quote}"` : ''}`,
              },
            ],
          };
          const exportFilename = `HTI-Application-${application.organizationName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
          await DataExporter.exportToPDF(exportConfig, exportFilename);
          break;

        case 'reject':
          await updateMutation.mutateAsync({
            id: applicationId,
            status: 'Rejected',
            notes: `Rejected on ${new Date().toLocaleDateString()}`,
          });
          setSelectedApplication({ ...application, status: 'Rejected' });
          break;
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      alert(`Failed to ${action}. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/60 via-white to-hti-sand/40">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <PageHero
        title="Marketing HUB"
        subtitle="Partnership application management for HTI's marketing team"
        theme="sunrise"
        actions={(
          <Link
            href="/"
            className="glass-button glass-button--accent text-sm font-semibold shadow-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-hti-navy/60"
            aria-label="Return to HUBDash home page"
          >
            ← Back to HUB
          </Link>
        )}
      />

      {/* Statistics Dashboard */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
        aria-labelledby="marketing-stats-heading"
      >
        <div id="marketing-stats-heading">
          <PageSectionHeading
            icon={<TrendingUp className="w-6 h-6 text-hti-teal" aria-hidden />}
            title="Application Pipeline"
            subtitle="Real-time overview of partnership applications"
            size="md"
            align="split"
            eyebrow="Pipeline overview"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              icon: <BarChart3 className="w-7 h-7 md:w-8 md:h-8" />,
              title: "Total Applications",
              value: stats.total,
              footer: "All statuses",
              glow: "from-hti-navy/40 to-hti-teal/25",
              iconColor: "text-hti-teal",
            },
            {
              icon: <Clock className="w-7 h-7 md:w-8 md:h-8" />,
              title: "Pending",
              value: stats.pending,
              footer: stats.pending > 0 ? "Action needed" : "All reviewed",
              glow: "from-hti-yellow/40 to-hti-orange/25",
              iconColor: "text-hti-yellow",
            },
            {
              icon: <Eye className="w-7 h-7 md:w-8 md:h-8" />,
              title: "In Review",
              value: stats.inReview,
              footer: "Being evaluated",
              glow: "from-hti-teal/40 to-hti-navy/25",
              iconColor: "text-hti-teal",
            },
            {
              icon: <CheckCircle className="w-7 h-7 md:w-8 md:h-8" />,
              title: "Approved",
              value: stats.approved,
              footer: "Ready to deliver",
              glow: "from-green-500/40 to-green-600/25",
              iconColor: "text-green-600",
            },
            {
              icon: <XCircle className="w-7 h-7 md:w-8 md:h-8" />,
              title: "Rejected",
              value: stats.rejected,
              footer: "Ineligible",
              glow: "from-red-500/40 to-red-600/25",
              iconColor: "text-red-600",
            },
            {
              icon: <Users className="w-7 h-7 md:w-8 md:h-8" />,
              title: "Chromebooks Needed",
              value: stats.totalChromebooks.toLocaleString(),
              footer: "Total requested",
              glow: "from-hti-teal/40 to-hti-navy/30",
              iconColor: "text-hti-teal",
            },
          ].map(({ icon, title, value, footer, glow, iconColor }, index) => (
            <div
              key={index}
              className="glass-card glass-card--subtle shadow-glass p-5 md:p-6 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className={`glass-card__glow bg-gradient-to-br ${glow}`} />
              <div className="relative z-10 space-y-3">
                <div className={`${iconColor} group-hover:scale-110 transition-transform origin-left`}>
                  {icon}
                </div>
                <div className="text-xs md:text-sm font-semibold text-glass-muted uppercase tracking-wide">{title}</div>
                <div className="text-3xl md:text-4xl font-bold text-glass-bright">{value}</div>
                <div className="text-xs text-glass-muted/80 font-medium">{footer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" role="main">
        <div>
          <PageSectionHeading
            title="Browse Applications"
            subtitle="Use filters and search to find applications. Click any card to view full details."
            size="md"
            actions={
              Array.isArray(partnerships) && filteredApplications.length !== partnerships.length ? (
                <div className="glass-chip glass-chip--yellow text-xs font-semibold inline-flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  {partnerships.length - filteredApplications.length} application{partnerships.length - filteredApplications.length !== 1 ? 's' : ''} hidden by filters
                </div>
              ) : null
            }
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20">
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
              totalCount={Array.isArray(partnerships) ? partnerships.length : 0}
            />

            {/* Loading State */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card glass-card--subtle shadow-glass h-64 animate-pulse" />
                ))}
              </div>
            ) : errorMessage ? (
              <EmptyState
                icon={<AlertCircle className="w-6 h-6" />}
                title="We can’t load partnership applications"
                description={errorMessage}
                actionLabel="Retry"
                onAction={() => {
                  setLoading(true);
                  fetch('/api/partnerships?filter=all')
                    .then(r => r.json())
                    .then(data => {
                      if (Array.isArray(data)) {
                        setPartnerships(data);
                        setErrorMessage(null);
                      } else {
                        setPartnerships([]);
                        setErrorMessage(typeof data?.error === 'string' ? data.error : 'Unexpected response from partnerships API.');
                      }
                    })
                    .catch(err => {
                      setErrorMessage(err instanceof Error ? err.message : 'Unable to load partnerships right now.');
                    })
                    .finally(() => setLoading(false));
                }}
                tone="warning"
              />
            ) : filteredApplications.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6" />}
                title="No applications match your filters"
                description="Reset filters or adjust your search to see more partnership requests."
                actionLabel="Clear filters"
                onAction={() => setFilters({
                  counties: [],
                  statuses: [],
                  chromebooksRange: { min: 0, max: 999999 },
                  dateRange: { start: null, end: null },
                  organizationTypes: [],
                  firstTimeOnly: null,
                  searchQuery: ''
                })}
              />
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
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}
