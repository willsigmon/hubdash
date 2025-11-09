"use client";

import ApplicationDetailPanel from "@/components/marketing/ApplicationDetailPanel";
import ApplicationFilters from "@/components/marketing/ApplicationFilters";
import ApplicationGrouping from "@/components/marketing/ApplicationGrouping";
import ApplicationSearch from "@/components/marketing/ApplicationSearch";
import { FilterOptions, GroupingOption, Partnership } from "@/types/partnership";
import {
  BarChart3,
  Megaphone,
  Rocket,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
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

  const journeyMoments = [
    {
      title: "Capture the Need",
      description: "See who needs Chromebooks and what stories they want to tell.",
      icon: Sparkles,
    },
    {
      title: "Shape the Story",
      description: "Highlight impact, quotes, and community goals in seconds.",
      icon: Megaphone,
    },
    {
      title: "Launch the Moment",
      description: "Spin up quote cards or spotlight sequences directly from the hub.",
      icon: Rocket,
    },
    {
      title: "Track the Ripple",
      description: "Watch approvals, pipeline stages, and community reach at a glance.",
      icon: Users,
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
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
            <div className="flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                <Sparkles className="h-3.5 w-3.5" />
                Marketing Mission Control
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Let’s turn every application into a story people feel.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/80">
                Welcome to the storyteller’s cockpit. Prioritize new partnerships, surface quotes,
                and launch campaigns celebrating the communities we serve.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  ← Return to HUB
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                  <Target className="h-4 w-4" />
                  Crafted for HTI storytellers
                </div>
              </div>
            </div>
            <div className="relative flex-1">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
              <div className="relative grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="group rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                      <span className="h-2 w-2 rounded-full bg-highlight" />
                      {stat.label}
                    </div>
                    <p className="mt-3 text-4xl font-bold text-white">{stat.value}</p>
                    <p className="mt-3 text-sm text-white/80">{stat.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-default bg-surface-alt/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  From inbox to impact
                </p>
                <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
                  A joyful, fast marketing journey for every applicant
                </h2>
                <p className="mt-3 max-w-3xl text-secondary">
                  Use these moment cards to spot the right stories, highlight community need, and
                  launch campaigns at the pace our partners deserve.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-highlight bg-soft-highlight px-4 py-2 text-xs font-semibold uppercase tracking-wide text-highlight shadow-sm">
                <BarChart3 className="h-4 w-4 text-highlight" />
                Live data fuel
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {journeyMoments.map((moment) => (
                <article
                  key={moment.title}
                  className="group relative overflow-hidden rounded-2xl border border-default bg-surface p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-strong hover:shadow-xl"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 transition group-hover:scale-125" />
                  <div className="relative flex h-full flex-col">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-soft-accent text-accent shadow-sm">
                      <moment.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">{moment.title}</h3>
                    <p className="mt-2 text-sm text-secondary">{moment.description}</p>
                    <div className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-highlight">
                      Story booster
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Command Center
              </p>
              <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
                Dive into applications, filters, and quotable gems
              </h2>
              <p className="mt-3 max-w-3xl text-secondary">
                Filter by region, status, or storytelling potential. Every row is ready for a quote
                card, social highlight, or partner follow-up.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              {loading ? "Syncing partnership data…" : "Live sync enabled"}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-[360px]">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl border border-default bg-surface p-6 shadow-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Filters
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-primary">
                        Fine-tune the story mix
                      </h3>
                    </div>
                    <Target className="h-8 w-8 text-accent" />
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
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-full bg-soft-accent p-2 text-accent">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                          Quick Spotlight
                        </p>
                        <h4 className="text-sm font-semibold text-primary">Hot story starters</h4>
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {spotlightApplications.map((application) => (
                        <li key={application.id} className="rounded-2xl border border-default bg-surface-elevated p-4 transition hover:border-strong">
                          <p className="text-sm font-semibold text-primary">
                            {application.organizationName}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                            {application.county || "Unknown County"} •{" "}
                            {application.chromebooksNeeded} requested
                          </p>
                          {application.quote && (
                            <p className="mt-2 text-sm text-secondary line-clamp-2">
                              “{application.quote}”
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
