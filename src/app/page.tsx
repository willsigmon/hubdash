import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageSectionHeading from "@/components/layout/PageSectionHeading";

const destinations = [
  {
    title: "Board Dashboard",
    description: "Executive summary with impact metrics, trends, and key insights for board members.",
    href: "/board",
    icon: "📊",
    action: "View Dashboard",
    glow: "from-hti-navy/40 to-hti-teal/30",
    chip: "glass-chip--yellow",
  },
  {
    title: "Operations HUB",
    description: "Mission control for inventory, donations, distributions, and training management.",
    href: "/ops",
    icon: "⚡",
    action: "Launch HUB",
    glow: "from-hti-orange/50 via-hti-yellow/35 to-hti-teal/30",
    chip: "glass-chip--orange text-hti-navy",
  },
  {
    title: "Grant Reports",
    description: "Generate quarterly reports, track grant goals, and export data for NCDIT compliance.",
    href: "/reports",
    icon: "📄",
    action: "Generate Reports",
    glow: "from-hti-yellow/35 to-hti-orange/35",
    chip: "glass-chip--yellow",
  },
  {
    title: "Marketing HUB",
    description: "Recipient stories, impact quotes, and partnership applications for marketing campaigns.",
    href: "/marketing",
    icon: "📣",
    action: "View Stories",
    glow: "from-hti-teal/35 via-hti-navy/35 to-hti-yellow/30",
    chip: "glass-chip--teal",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/70 via-white to-hti-sand/40">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <PageHero
        title="HUBDash"
        subtitle="Pick a workspace to dive into live data for boards, operations, grants, or marketing."
        eyebrow="HTI Platform"
        align="center"
        theme="sunrise"
        showLogo
        actions={(
          <div className="glass-chip glass-chip--yellow text-xs font-semibold">
            Securely Repurposing Technology. Expanding Digital Opportunity.
          </div>
        )}
      />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
        role="main"
      >
        <section className="space-y-6">
          <PageSectionHeading
            title="Select a mission-ready workspace"
            subtitle="Every hub shares the same glass design language, CTA styles, and accessibility affordances so navigation feels seamless."
            size="md"
            align="stacked"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((card) => (
              <article key={card.href} className="relative">
                <div className="glass-card glass-card--subtle shadow-glass h-full flex flex-col">
                  <div className={`glass-card__glow bg-gradient-to-br ${card.glow}`} />
                  <div className="relative z-10 flex flex-col h-full p-6 space-y-4">
                    <span className="text-4xl" aria-hidden="true">{card.icon}</span>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-glass-bright">{card.title}</h2>
                      <p className="text-sm text-glass-muted">{card.description}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t glass-divider">
                      <Link
                        href={card.href}
                        className={`inline-flex items-center gap-2 glass-chip ${card.chip} text-xs font-semibold hover:translate-x-1 transition-transform`}
                      >
                        <span>{card.action}</span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M13 7l5 5-5 5" />
                          <path d="M6 12h12" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="text-center text-sm text-hti-stone/70 space-y-2 pb-12" role="contentinfo">
          <p>HUBZone Technology Initiative • Henderson, NC</p>
          <p>
            <a
              href="https://hubzonetech.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hti-navy font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-hti-ember rounded"
            >
              hubzonetech.org
            </a>
          </p>
          <p className="text-xs">Powered by Knack • Live data synced from HTI's database</p>
        </footer>
      </main>
    </div>
  );
}
