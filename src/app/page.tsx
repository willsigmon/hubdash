import GlassCard from "@/components/ui/GlassCard";
import GradientHeading from "@/components/ui/GradientHeading";
import { ArrowRight, FileText, LayoutDashboard, Megaphone, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-6">
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-surface focus:text-primary focus:px-4 focus:py-2 focus:rounded-md focus:shadow"
      >
        Skip to main content
      </a>

      <div className="w-full max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-10 md:mb-14">
          <GradientHeading as="h1" className="text-5xl md:text-6xl">HubDash</GradientHeading>
          <p className="text-lg md:text-xl text-secondary mt-3">HUBZone Technology Initiative Dashboard</p>
          <p className="text-sm text-muted mt-1">Securely repurposing technology. Expanding digital opportunity.</p>
        </div>

        {/* Destinations */}
        <main id="main" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" aria-label="Hub destinations">
          <Link href="/board" aria-label="Open Board Dashboard — executive metrics and trends" className="group">
            <GlassCard interactive elevation="lg" className="p-6 md:p-8 h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl accent-gradient text-white shadow">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-primary mb-1">Board Dashboard</h2>
                  <p className="text-sm text-secondary mb-4">Executive summary with impact metrics, trends, and insights for board members.</p>
                  <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm">
                    <span>View Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link href="/ops" aria-label="Launch Operations HUB — inventory, donations, distributions, training" className="group">
            <GlassCard interactive elevation="lg" className="p-6 md:p-8 h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl accent-gradient text-white shadow">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-primary mb-1">Operations HUB</h2>
                  <p className="text-sm text-secondary mb-4">Mission control for inventory, donations, distributions, and training management.</p>
                  <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm">
                    <span>Launch HUB</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link href="/reports" aria-label="Generate Grant Reports — quarterly reports, goals, NCDIT exports" className="group">
            <GlassCard interactive elevation="lg" className="p-6 md:p-8 h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl accent-gradient text-white shadow">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-primary mb-1">Grant Reports</h2>
                  <p className="text-sm text-secondary mb-4">Generate quarterly reports, track grant goals, and export data for NCDIT compliance.</p>
                  <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm">
                    <span>Generate Reports</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link href="/marketing" aria-label="Open Marketing HUB — recipient stories and partnership applications" className="group">
            <GlassCard interactive elevation="lg" className="p-6 md:p-8 h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl accent-gradient text-white shadow">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-primary mb-1">Marketing HUB</h2>
                  <p className="text-sm text-secondary mb-4">Recipient stories, impact quotes, and partnership applications for marketing campaigns.</p>
                  <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm">
                    <span>View Stories</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        </main>

        {/* Footer */}
        <div className="mt-10 md:mt-12 text-center text-sm text-secondary">
          <p>HUBZone Technology Initiative • Henderson, NC</p>
          <p className="mt-1">
            <a
              href="https://hubzonetech.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:underline focus-visible:outline-none focus-ring rounded"
            >
              hubzonetech.org
            </a>
          </p>
          <p className="mt-4 text-xs text-muted">Powered by Knack • Real-time data from HTI's database</p>
        </div>
      </div>
    </div>
  );
}
