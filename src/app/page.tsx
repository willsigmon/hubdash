import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-navy/95 to-hti-navy flex items-center justify-center p-6">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="max-w-6xl w-full glass-card glass-card--subtle shadow-glass rounded-3xl p-8 md:p-12">
        <div className="absolute inset-0 glass-card__glow bg-gradient-to-br from-hti-teal/40 to-hti-yellow/30" />
        <div className="relative text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src="/hti-logo.svg"
              alt="HTI Logo"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-glass-bright">
            HUBDash
          </h1>
          <p className="text-xl text-glass-bright/80 font-semibold tracking-wide uppercase">
            HUBZone Technology Initiative Dashboard
          </p>
          <p className="text-sm text-glass-muted mt-2 font-medium">
            Securely Repurposing Technology. Expanding Digital Opportunity.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Board Dashboard Card */}
          <Link
            href="/board"
            className="group glass-card glass-card--subtle hover:-translate-y-1 transition-transform duration-300 min-h-[300px] flex flex-col"
            aria-label="Navigate to Board Dashboard - Executive summary with impact metrics"
          >
            <div className="glass-card__glow bg-gradient-to-br from-hti-navy/50 to-hti-teal/30" />
            <div className="relative z-10 text-left space-y-4">
              <div className="text-5xl" aria-hidden="true">📊</div>
              <h2 className="text-3xl font-bold text-glass-bright">Board Dashboard</h2>
              <p className="text-glass-muted text-base font-medium">
                Executive summary with impact metrics, trends, and key insights for board members.
              </p>
              <div className="inline-flex items-center glass-chip glass-chip--yellow text-xs font-semibold">
                <span>View Dashboard</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 to-hti-yellow/20" />
          </Link>

          {/* Ops Dashboard Card */}
          <Link
            href="/ops"
            className="group glass-card glass-card--subtle hover:-translate-y-1 transition-transform duration-300 min-h-[300px] flex flex-col"
            aria-label="Navigate to Operations HUB - Mission control for inventory and donations"
          >
            <div className="glass-card__glow bg-gradient-to-br from-hti-orange/60 via-hti-yellow/40 to-hti-teal/30" />
            <div className="relative z-10 text-left space-y-4">
              <div className="text-5xl" aria-hidden="true">⚡</div>
              <h2 className="text-3xl font-bold text-glass-bright">Operations HUB</h2>
              <p className="text-glass-muted text-base font-medium">
                Mission control for inventory, donations, distributions, and training management.
              </p>
              <div className="inline-flex items-center glass-chip glass-chip--orange text-xs font-semibold text-hti-navy">
                <span>Launch HUB</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 via-hti-orange/20 to-hti-yellow/20" />
          </Link>

          {/* Reports Dashboard Card */}
          <Link
            href="/reports"
            className="group glass-card glass-card--subtle hover:-translate-y-1 transition-transform duration-300 min-h-[300px] flex flex-col"
            aria-label="Navigate to Grant Reports - Generate quarterly reports and track grant goals"
          >
            <div className="glass-card__glow bg-gradient-to-br from-hti-yellow/40 to-hti-orange/35" />
            <div className="relative z-10 text-left space-y-4">
              <div className="text-4xl" aria-hidden="true">📄</div>
              <h2 className="text-2xl font-bold text-glass-bright">Grant Reports</h2>
              <p className="text-glass-muted text-base font-medium">
                Generate quarterly reports, track grant goals, and export data for NCDIT compliance.
              </p>
              <div className="inline-flex items-center glass-chip glass-chip--yellow text-xs font-semibold">
                <span>Generate Reports</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 to-hti-yellow/15" />
          </Link>

          {/* Marketing HUB Card */}
          <Link
            href="/marketing"
            className="group glass-card glass-card--subtle hover:-translate-y-1 transition-transform duration-300 min-h-[300px] flex flex-col"
            aria-label="Navigate to Marketing HUB - Recipient stories and partnership applications"
          >
            <div className="glass-card__glow bg-gradient-to-br from-hti-teal/35 via-hti-navy/40 to-hti-yellow/30" />
            <div className="relative z-10 text-left space-y-4">
              <div className="text-4xl" aria-hidden="true">📣</div>
              <h2 className="text-2xl font-bold text-glass-bright">Marketing HUB</h2>
              <p className="text-glass-muted text-base font-medium">
                Recipient stories, impact quotes, and partnership applications for marketing campaigns.
              </p>
              <div className="inline-flex items-center glass-chip glass-chip--teal text-xs font-semibold">
                <span>View Stories</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 via-hti-teal/20 to-hti-yellow/15" />
          </Link>
        </div>

        <div className="relative mt-12 text-center text-sm text-glass-muted">
          <p>HUBZone Technology Initiative • Henderson, NC</p>
          <p className="mt-1">
            <a
              href="https://hubzonetech.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-glass-bright font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-hti-orange focus:ring-offset-2 rounded"
            >
              hubzonetech.org
            </a>
          </p>
          <p className="mt-4 text-xs text-glass-muted/70">
            Powered by Knack • Real-time data from HTI's database
          </p>
        </div>
      </div>
      <main id="main-content" className="sr-only">Main content</main>
    </div>
  );
}
