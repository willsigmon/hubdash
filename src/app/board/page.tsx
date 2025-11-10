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
            <GradientHeading as="h1" variant="accent" className="text-2xl sm:text-3xl text-primary theme-dim:text-white">
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
        </section>

        {/* Executive Signals - Full Width */}
        <section>
          <div className="rounded-2xl border-2 border-default bg-gradient-to-br from-surface via-surface to-surface-alt p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-2xl md:text-3xl font-black text-primary mb-2">Executive Signals</h3>
              <p className="text-sm font-semibold text-secondary">
                Curated highlights surfaced automatically each morning
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {momentumPulses.map((pulse) => (
                <div
                  key={pulse.title}
                  className={`group rounded-xl border-2 px-5 py-4 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                    pulse.tone === "positive"
                      ? "border-success/50 bg-gradient-to-br from-soft-success to-surface hover:border-success"
                      : pulse.tone === "accent"
                        ? "border-accent/50 bg-gradient-to-br from-soft-accent to-surface hover:border-accent"
                        : "border-highlight/50 bg-gradient-to-br from-soft-highlight to-surface hover:border-highlight"
                  }`}
                >
                  <p className="font-black text-base md:text-lg text-primary mb-2">{pulse.title}</p>
                  <p className="text-sm font-semibold text-secondary leading-relaxed">{pulse.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trends & Geography - Perfectly Aligned */}
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Left: Trend Chart - Enhanced */}
            <div className="space-y-4">
              <div className="space-y-2">
                <GradientHeading className="text-3xl md:text-4xl" variant="navy">
                  Momentum &amp; Trajectory
                </GradientHeading>
                <p className="text-base font-semibold text-secondary">
                  Rolling performance trends to anticipate capacity needs and outreach impact
                </p>
              </div>
              <div className="rounded-2xl border-2 border-default bg-surface p-6 shadow-xl">
                <TrendChart />
              </div>
            </div>

            {/* Right: Regional Reach - Enhanced */}
            <div className="rounded-2xl border-2 border-default bg-gradient-to-br from-surface via-surface-alt to-surface p-6 shadow-xl">
              <div className="mb-4">
                <h3 className="text-2xl md:text-3xl font-black text-primary mb-2">Regional Reach</h3>
                <p className="text-sm font-semibold text-secondary">
                  Distribution footprint across served counties highlighting growth corridors
                </p>
              </div>
              <CountyMap />
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
