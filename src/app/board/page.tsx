import CountyMap from "@/components/board/CountyMap";
import ImpactMetrics from "@/components/board/ImpactMetrics";
import { LiveImpactCounter } from "@/components/board/LiveImpactCounter";
import RecentActivity from "@/components/board/RecentActivity";
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

      {/* Header */}
      <header className="relative border-b border-default bg-gradient-to-br from-hti-navy via-hti-navy-dark to-hti-navy text-white shadow-xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-1/3 h-56 w-56 rounded-full bg-highlight opacity-30 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent opacity-25 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <GradientHeading as="h1" variant="white" className="text-4xl md:text-5xl">
              HTI Board Dashboard
            </GradientHeading>
            <p className="text-lg font-medium text-white">
              A crisp mission status report showcasing live deployments, community reach, and grant
              pacing.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-highlight bg-soft-highlight px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-highlight">
              Live signals • auto-refreshing every few minutes
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            ← Back to HUB
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero / Live Impact */}
        <section className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-default bg-surface/95 p-8 shadow-xl animate-in slide-up duration-300">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <GradientHeading className="text-3xl md:text-4xl">
                    Mission Impact Pulse
                  </GradientHeading>
                  <span className="rounded-full border border-accent bg-soft-accent px-3 py-1 text-xs font-semibold text-accent">
                    Live data
                  </span>
                </div>
                <p className="max-w-2xl text-base text-secondary">
                  Monitor real-time laptop conversions, training throughput, and partner engagement.
                  These signals align with quarterly board scorecards.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {executiveSignals.map((signal) => (
                    <article
                      key={signal.label}
                      className="group rounded-2xl border border-default bg-surface-alt p-5 shadow-sm transition hover:-translate-y-1 hover:border-strong hover:shadow-md"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                        {signal.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-primary">{signal.value}</p>
                      <p className="mt-2 text-sm text-secondary">{signal.description}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-default bg-surface p-6 shadow-lg">
                <LiveImpactCounter />
              </div>
              <ImpactMetrics />
            </div>
            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-default bg-surface p-6 shadow-lg">
                <h3 className="text-xl font-bold text-primary">Executive Signals</h3>
                <p className="mt-2 text-sm text-secondary">
                  Curated highlights surfaced automatically each morning.
                </p>
                <ul className="mt-5 space-y-4 text-sm text-secondary">
                  {momentumPulses.map((pulse) => (
                    <li
                      key={pulse.title}
                      className={`rounded-2xl border px-4 py-3 ${
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
              <div className="rounded-3xl border border-default bg-surface-alt p-6 shadow-inner">
                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary">
                  Quick Links
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
                  <Link
                    href="/ops"
                    className="rounded-xl border border-accent bg-soft-accent px-3 py-2 text-accent transition hover:bg-soft-accent"
                  >
                    Operations
                  </Link>
                  <Link
                    href="/reports"
                    className="rounded-xl border border-highlight bg-soft-highlight px-3 py-2 text-highlight transition hover:bg-soft-highlight"
                  >
                    Reports
                  </Link>
                  <Link
                    href="/board"
                    className="rounded-xl border border-success bg-soft-success px-3 py-2 text-success transition hover:bg-soft-success"
                  >
                    Board
                  </Link>
                  <Link
                    href="/marketing"
                    className="rounded-xl border border-accent bg-soft-accent px-3 py-2 text-accent transition hover:bg-soft-accent"
                  >
                    Marketing
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Trends & Geography */}
        <section className="space-y-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div className="space-y-3">
                <GradientHeading className="text-3xl md:text-4xl" variant="navy">
                  Momentum &amp; Trajectory
                </GradientHeading>
                <p className="max-w-2xl text-base text-secondary">
                  Rolling performance trends to anticipate capacity needs and outreach impact.
                  Annotations highlight grant milestones and county expansions.
                </p>
              </div>
              <div className="rounded-3xl border border-default bg-surface p-6 shadow-lg">
                <TrendChart />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-default bg-surface p-6 shadow-lg">
                <h3 className="text-xl font-bold text-primary">Regional Reach</h3>
                <p className="mb-4 text-sm text-secondary">
                  Distribution footprint across served counties highlighting growth corridors.
                </p>
                <CountyMap />
              </div>
              <div className="rounded-3xl border border-default bg-surface-alt p-6 shadow-inner">
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
                  What’s next
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-secondary">
                  <li>✓ Supabase integration prep for real-time board packets</li>
                  <li>✓ Partner pipeline automation in progress</li>
                  <li>▢ Launch county deep-dive briefing cards</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <GradientHeading className="mb-1 text-3xl md:text-4xl" variant="accent">
                Recent Activity
              </GradientHeading>
              <p className="text-base text-secondary">
                Latest operational and impact milestones (auto-refreshing).
              </p>
            </div>
            <Link
              href="/reports"
              className="rounded-xl border border-default bg-surface-alt px-5 py-3 text-sm font-semibold text-secondary transition hover:text-primary"
            >
              View Detailed Reports →
            </Link>
          </div>
          <div className="rounded-3xl border border-default bg-surface p-6 shadow-lg">
            <RecentActivity />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-default bg-surface-alt">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-secondary">
            HTI Board Dashboard — Turning donations into opportunities
          </p>
        </div>
      </footer>
    </div>
  );
}
