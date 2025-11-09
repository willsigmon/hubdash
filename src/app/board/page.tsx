import CountyMap from "@/components/board/CountyMap";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import { LiveImpactCounter } from "@/components/board/LiveImpactCounter";
import SocialMediaFeed from "@/components/marketing/SocialMediaFeed";
import TrendChart from "@/components/board/TrendChart";
import GradientHeading from "@/components/ui/GradientHeading";
import Link from "next/link";

const executiveSignals = [
  {
    label: "Impact Placements",
    value: "2,540",
    description: "Chromebooks delivered lifetime; 85 this quarter.",
  },
  {
    label: "County Coverage",
    value: "15",
    description: "Counties served through Digital Champion Grant lanes.",
  },
  {
    label: "Training Graduates",
    value: "450",
    description: "Community members completing HTI digital literacy sessions.",
  },
];

const momentumPulses = [
  {
    title: "Grant runway on-pace",
    detail: "Digital Champion inventory tracking to 98% of target.",
    tone: "positive" as const,
  },
  {
    title: "Veteran outreach surging",
    detail: "3 new veteran-serving partners onboarded in past 30 days.",
    tone: "accent" as const,
  },
  {
    title: "Saturation watch",
    detail: "Wake & Catawba counties nearing equipment thresholds; review pipeline.",
    tone: "caution" as const,
  },
];

export default function BoardDashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-hti-navy/25 via-hti-navy/10 to-transparent" />

      {/* Header - Compact */}
      <header className="sticky top-0 z-40 border-b border-default bg-gradient-to-br from-surface via-surface-alt to-surface shadow-lg theme-dim:from-hti-navy theme-dim:via-hti-navy-dark theme-dim:to-hti-navy">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute -left-24 top-1/3 h-40 w-40 rounded-full bg-highlight opacity-30 blur-3xl" />
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent opacity-25 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <GradientHeading as="h1" variant="default" className="text-2xl sm:text-3xl theme-dim:text-white">
              HTI Board Dashboard
            </GradientHeading>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-xs font-semibold text-secondary theme-dim:text-white/90">Live</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-surface-alt theme-dim:bg-white/10 px-4 py-2 text-xs font-semibold text-primary theme-dim:text-white transition hover:bg-surface theme-dim:hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            ← HUB
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero / Live Impact - Horizontal Compact Layout */}
        <section className="space-y-6">
          {/* Top Row - Mission Impact Pulse + Live Counter */}
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Mission Impact Pulse - Enhanced */}
            <div className="rounded-2xl border-2 border-default bg-gradient-to-br from-surface via-surface to-surface-alt p-6 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <GradientHeading className="text-3xl md:text-4xl mb-1">
                    Mission Impact Pulse
                  </GradientHeading>
                  <p className="text-sm font-semibold text-secondary">
                    Real-time metrics across all HTI operations
                  </p>
                </div>
                <span className="rounded-full border-2 border-accent bg-soft-accent px-3 py-1.5 text-xs font-black uppercase tracking-wide text-accent shadow-sm">
                  Live
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {executiveSignals.map((signal) => (
                  <article
                    key={signal.label}
                    className="group relative overflow-hidden rounded-xl border-2 border-default bg-surface p-4 shadow-lg transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-5 transition-opacity" />
                    <div className="relative">
                      <p className="text-[10px] font-black uppercase tracking-wider text-secondary mb-2">
                        {signal.label}
                      </p>
                      <p className="text-3xl md:text-4xl font-black text-primary mb-1 group-hover:text-accent transition-colors">
                        {signal.value}
                      </p>
                      <p className="text-xs font-semibold text-secondary leading-relaxed">
                        {signal.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Live Impact Counter - Compact */}
            <div className="rounded-2xl border-2 border-default bg-surface p-6 shadow-xl">
              <LiveImpactCounter />
            </div>
          </div>

          {/* Impact Metrics - Full Width Row */}
          <div className="rounded-2xl border-2 border-default bg-surface p-6 shadow-xl">
            <ImpactMetrics />
          </div>

            {/* Right Column - Executive Signals & Quick Links */}
            <aside className="flex flex-col gap-6">
              {/* Executive Signals - Enhanced */}
              <div className="rounded-2xl border-2 border-default bg-gradient-to-br from-surface via-surface to-surface-alt p-6 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Executive Signals</h3>
                  <p className="text-xs font-medium text-secondary">
                    Curated highlights surfaced automatically each morning
                  </p>
                </div>
                <ul className="space-y-4">
                  {momentumPulses.map((pulse) => (
                    <li
                      key={pulse.title}
                      className={`group rounded-xl border-2 px-5 py-4 shadow-md transition-all hover:shadow-lg ${pulse.tone === "positive"
                          ? "border-success/50 bg-gradient-to-br from-soft-success to-surface"
                          : pulse.tone === "accent"
                            ? "border-accent/50 bg-gradient-to-br from-soft-accent to-surface"
                            : "border-highlight/50 bg-gradient-to-br from-soft-highlight to-surface"
                        }`}
                    >
                      <p className="font-bold text-sm text-primary mb-1.5">{pulse.title}</p>
                      <p className="text-xs font-medium text-secondary leading-relaxed">{pulse.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links - Enhanced */}
              <div className="rounded-2xl border-2 border-default bg-surface-alt p-6 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-5">
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/ops"
                    className="group rounded-xl border-2 border-accent/50 bg-soft-accent px-4 py-3 text-center text-sm font-bold text-accent transition-all hover:border-accent hover:bg-accent hover:text-on-accent hover:shadow-lg"
                  >
                    Operations
                  </Link>
                  <Link
                    href="/reports"
                    className="group rounded-xl border-2 border-highlight/50 bg-soft-highlight px-4 py-3 text-center text-sm font-bold text-highlight transition-all hover:border-highlight hover:bg-highlight hover:text-on-highlight hover:shadow-lg"
                  >
                    Reports
                  </Link>
                  <Link
                    href="/board"
                    className="group rounded-xl border-2 border-success/50 bg-soft-success px-4 py-3 text-center text-sm font-bold text-success transition-all hover:border-success hover:bg-success hover:text-on-success hover:shadow-lg"
                  >
                    Board
                  </Link>
                  <Link
                    href="/marketing"
                    className="group rounded-xl border-2 border-accent/50 bg-soft-accent px-4 py-3 text-center text-sm font-bold text-accent transition-all hover:border-accent hover:bg-accent hover:text-on-accent hover:shadow-lg"
                  >
                    Marketing
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Trends & Geography - Perfectly Aligned */}
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Left: Trend Chart - Enhanced */}
            <div className="space-y-6">
              <div className="space-y-3">
                <GradientHeading className="text-3xl md:text-4xl" variant="navy">
                  Momentum &amp; Trajectory
                </GradientHeading>
                <p className="text-sm font-medium text-secondary">
                  Rolling performance trends to anticipate capacity needs and outreach impact
                </p>
              </div>
              <div className="rounded-2xl border-2 border-default bg-surface p-8 shadow-xl">
                <TrendChart />
              </div>
            </div>

            {/* Right: County Map & What's Next - Perfectly Stacked */}
            <div className="flex flex-col gap-6">
              {/* Regional Reach - Enhanced */}
              <div className="rounded-2xl border-2 border-default bg-surface p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-primary mb-2">Regional Reach</h3>
                  <p className="text-xs font-medium text-secondary">
                    Distribution footprint across served counties highlighting growth corridors
                  </p>
                </div>
                <CountyMap />
              </div>

              {/* What's Next - Enhanced */}
              <div className="rounded-2xl border-2 border-default bg-gradient-to-br from-surface-alt to-surface p-6 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                  What's Next
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold mt-0.5">✓</span>
                    <span className="text-secondary font-medium">Supabase integration prep for real-time board packets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold mt-0.5">✓</span>
                    <span className="text-secondary font-medium">Partner pipeline automation in progress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold mt-0.5">▢</span>
                    <span className="text-secondary font-medium">Launch county deep-dive briefing cards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Feed - Full Width */}
        <section>
          <div className="rounded-2xl border-2 border-default bg-surface shadow-xl overflow-hidden">
            <div className="p-8">
              <SocialMediaFeed />
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Enhanced */}
      <footer className="mt-16 border-t-2 border-default bg-gradient-to-br from-surface-alt to-surface">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-primary">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
