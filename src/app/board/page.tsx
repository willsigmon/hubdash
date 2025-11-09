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
    value: "2,540+",
    description: "Chromebooks delivered lifetime; 85 this quarter.",
  },
  {
    label: "County Coverage",
    value: "15",
    description: "Counties served through Digital Champion Grant lanes.",
  },
  {
    label: "Training Graduates",
    value: "450+",
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
      <header className="sticky top-0 z-40 border-b border-default bg-gradient-to-br from-hti-navy via-hti-navy-dark to-hti-navy text-white shadow-lg">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute -left-24 top-1/3 h-40 w-40 rounded-full bg-highlight opacity-30 blur-3xl" />
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent opacity-25 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <GradientHeading as="h1" variant="white" className="text-2xl sm:text-3xl">
              HTI Board Dashboard
            </GradientHeading>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-xs font-semibold text-white/90">Live</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            ← HUB
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero / Live Impact */}
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <GradientHeading className="text-2xl md:text-3xl">
                    Mission Impact Pulse
                  </GradientHeading>
                  <span className="rounded-full border border-accent bg-soft-accent px-2.5 py-1 text-[10px] font-semibold text-accent">
                    Live
                  </span>
                </div>
                <p className="mb-6 text-sm text-secondary">
                  Monitor real-time laptop conversions, training throughput, and partner engagement.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {executiveSignals.map((signal) => (
                    <article
                      key={signal.label}
                      className="group rounded-xl border border-default bg-surface-alt p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-strong hover:shadow-md"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-2">
                        {signal.label}
                      </p>
                      <p className="text-xl font-bold text-primary mb-1">{signal.value}</p>
                      <p className="text-xs text-secondary">{signal.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
                <LiveImpactCounter />
              </div>
              <ImpactMetrics />
            </div>
            <aside className="flex flex-col gap-6">
              <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-2">Executive Signals</h3>
                <p className="mb-4 text-xs text-secondary">
                  Curated highlights surfaced automatically each morning.
                </p>
                <ul className="space-y-3 text-sm">
                  {momentumPulses.map((pulse) => (
                    <li
                      key={pulse.title}
                      className={`rounded-xl border px-4 py-3 ${
                        pulse.tone === "positive"
                          ? "border-success bg-soft-success text-success"
                          : pulse.tone === "accent"
                          ? "border-accent bg-soft-accent text-accent"
                          : "border-highlight bg-soft-highlight text-highlight"
                      }`}
                    >
                      <p className="font-semibold text-sm">{pulse.title}</p>
                      <p className="mt-1 text-xs text-current/90">{pulse.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-default bg-surface-alt p-6">
                <h4 className="text-xs font-bold uppercase tracking-wide text-secondary mb-4">
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <Link
                    href="/ops"
                    className="rounded-lg border border-accent bg-soft-accent px-3 py-2 text-accent transition hover:bg-soft-accent"
                  >
                    Operations
                  </Link>
                  <Link
                    href="/reports"
                    className="rounded-lg border border-highlight bg-soft-highlight px-3 py-2 text-highlight transition hover:bg-soft-highlight"
                  >
                    Reports
                  </Link>
                  <Link
                    href="/board"
                    className="rounded-lg border border-success bg-soft-success px-3 py-2 text-success transition hover:bg-soft-success"
                  >
                    Board
                  </Link>
                  <Link
                    href="/marketing"
                    className="rounded-lg border border-accent bg-soft-accent px-3 py-2 text-accent transition hover:bg-soft-accent"
                  >
                    Marketing
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Trends & Geography */}
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-2">
                <GradientHeading className="text-2xl md:text-3xl" variant="navy">
                  Momentum &amp; Trajectory
                </GradientHeading>
                <p className="text-sm text-secondary">
                  Rolling performance trends to anticipate capacity needs and outreach impact.
                </p>
              </div>
              <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
                <TrendChart />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-3">Regional Reach</h3>
                <p className="mb-4 text-xs text-secondary">
                  Distribution footprint across served counties highlighting growth corridors.
                </p>
                <CountyMap />
              </div>
              <div className="rounded-2xl border border-default bg-surface-alt p-6">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-secondary mb-3">
                  What's next
                </h4>
                <ul className="space-y-2 text-xs text-secondary">
                  <li>✓ Supabase integration prep for real-time board packets</li>
                  <li>✓ Partner pipeline automation in progress</li>
                  <li>▢ Launch county deep-dive briefing cards</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Feed */}
        <section>
          <SocialMediaFeed />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-default bg-surface-alt">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium text-secondary">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
