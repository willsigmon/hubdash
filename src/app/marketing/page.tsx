"use client";

import ApplicationDetailPanel from "@/components/marketing/ApplicationDetailPanel";
import ApplicationFilters from "@/components/marketing/ApplicationFilters";
import ApplicationGrouping from "@/components/marketing/ApplicationGrouping";
import ApplicationSearch from "@/components/marketing/ApplicationSearch";
import { FilterOptions, GroupingOption, Partnership } from "@/types/partnership";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function MarketingPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Partnership | null>(null);
  const [groupBy, setGroupBy] = useState<GroupingOption["value"]>("status");

  const [filters, setFilters] = useState<FilterOptions>({
    counties: [],
    statuses: [],
    chromebooksRange: { min: 0, max: 999999 },
    dateRange: { start: null, end: null },
    organizationTypes: [],
    firstTimeOnly: null,
    searchQuery: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch("/api/partnerships?filter=all")
      .then((r) => r.json())
      .then((data) => {
        setPartnerships(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading partnerships:", error);
        setLoading(false);
      });
  }, []);

  const availableCounties = useMemo(() => {
    const counties = new Set<string>();
    partnerships.forEach((p) => {
      if (p.county && p.county !== "Unknown") {
        counties.add(p.county);
      }
    });
    return Array.from(counties);
  }, [partnerships]);

  const availableOrgTypes = useMemo(() => {
    const types = new Set<string>();
    partnerships.forEach((p) => {
      if (p.organizationType) {
        types.add(p.organizationType);
      }
    });
    return Array.from(types);
  }, [partnerships]);

  const filteredApplications = useMemo(() => {
    return partnerships.filter((app) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) {
        return false;
      }

      if (filters.counties.length > 0 && !filters.counties.includes(app.county)) {
        return false;
      }

      if (
        app.chromebooksNeeded < filters.chromebooksRange.min ||
        app.chromebooksNeeded > filters.chromebooksRange.max
      ) {
        return false;
      }

      if (filters.dateRange.start || filters.dateRange.end) {
        const appDate = new Date(app.timestamp);
        if (filters.dateRange.start && appDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && appDate > filters.dateRange.end) {
          return false;
        }
      }

      if (
        filters.organizationTypes.length > 0 &&
        !filters.organizationTypes.includes(app.organizationType || "")
      ) {
        return false;
      }

      if (filters.firstTimeOnly !== null && app.firstTime !== filters.firstTimeOnly) {
        return false;
      }

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
          ...(app.clientStruggles || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [partnerships, filters]);

  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter((a) => a.status === "Pending").length;
    const approved = filteredApplications.filter((a) => a.status === "Approved").length;
    const inReview = filteredApplications.filter((a) => a.status === "In Review").length;
    const rejected = filteredApplications.filter((a) => a.status === "Rejected").length;
    const totalChromebooks = filteredApplications.reduce(
      (sum, a) => sum + a.chromebooksNeeded,
      0,
    );

    return { total, pending, approved, inReview, rejected, totalChromebooks };
  }, [filteredApplications]);

  const heroStats = [
    {
      label: "Active Storytellers",
      value: stats.total,
      description: "Organizations currently sharing HTI impact stories.",
    },
    {
      label: "Chromebooks Requested",
      value: stats.totalChromebooks,
      description: "Keeps the mission roadmapped and resourced.",
    },
    {
      label: "Ready to Spotlight",
      value: stats.approved,
      description: "Approved partners awaiting marketing uplift.",
    },
  ];

  const spotlightApplications = useMemo(() => {
    return filteredApplications.slice(0, 3);
  }, [filteredApplications]);

  const handleAction = (action: string, applicationId: string) => {
    console.log(`Action: ${action} for application ${applicationId}`);
    switch (action) {
      case "approve":
        alert(`Approve application ${applicationId}`);
        break;
      case "request-info":
        alert(`Request more info for ${applicationId}`);
        break;
      case "schedule":
        alert(`Schedule delivery for ${applicationId}`);
        break;
      case "contact":
        alert(`Mark ${applicationId} as contacted`);
        break;
      case "quote-card":
        alert(`Generate quote card for ${applicationId}`);
        break;
      case "export":
        alert(`Export ${applicationId} to PDF`);
        break;
    }
  };

  return (
    <div className="relative min-h-screen bg-app">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-hti-yellow/30 blur-3xl" />
      </div>

      <main className="relative">
        <header className="border-b border-default bg-gradient-to-br from-hti-navy via-hti-navy-dark to-hti-navy text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Partnership Applications
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/90">
                Review, filter, and manage partnership applications. Track quotes and impact stories for marketing use.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  ← Return to HUB
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 lg:flex-1">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </header>


        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary md:text-3xl">
                Applications & Filters
              </h2>
              <p className="mt-2 max-w-3xl text-secondary">
                Filter by county, status, organization type, or search by keywords. Click any application to view details and generate quote cards.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              {loading ? "Loading…" : `${filteredApplications.length} of ${partnerships.length} applications`}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-[360px]">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-default bg-surface p-6 shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary">
                      Filters
                    </h3>
                    <p className="mt-1 text-sm text-secondary">
                      Narrow down applications by status, county, organization type, and more.
                    </p>
                  </div>
                  <ApplicationFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableCounties={availableCounties}
                    availableOrgTypes={availableOrgTypes}
                  />
                </div>

                {spotlightApplications.length > 0 && (
                  <div className="rounded-3xl border border-default bg-surface-alt p-6 shadow-lg">
                    <h4 className="text-sm font-semibold text-primary mb-4">Recent Applications</h4>
                    <ul className="space-y-3">
                      {spotlightApplications.map((application) => (
                        <li key={application.id} className="rounded-xl border border-default bg-surface-elevated p-3 transition hover:border-strong">
                          <p className="text-sm font-semibold text-primary">
                            {application.organizationName}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {application.county || "Unknown County"} • {application.chromebooksNeeded} requested
                          </p>
                          {application.quote && (
                            <p className="mt-2 text-xs text-secondary line-clamp-2">
                              "{application.quote}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <ApplicationSearch
                searchQuery={filters.searchQuery}
                onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
                resultCount={filteredApplications.length}
                totalCount={partnerships.length}
              />

              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-64 rounded-2xl border border-default bg-surface animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <ApplicationGrouping
                  applications={filteredApplications}
                  groupBy={groupBy}
                  onGroupByChange={setGroupBy}
                  onApplicationClick={setSelectedApplication}
                />
              )}
            </div>
          </div>
        </section>
      </main>

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
