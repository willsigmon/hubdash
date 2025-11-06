import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-gray to-hti-navy flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-hti-navy mb-4">
            HubDash
          </h1>
          <p className="text-xl text-hti-navy font-medium">
            HUBZone Technology Initiative Dashboard
          </p>
          <p className="text-sm text-hti-gray mt-2 font-medium">
            Securely Repurposing Technology. Expanding Digital Opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Board Dashboard Card */}
          <Link
            href="/board"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-hti-navy to-hti-gray p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[300px] flex flex-col border-2 border-hti-yellow/30"
          >
            <div className="relative z-10 text-white">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-3xl font-bold mb-3 text-white">Board Dashboard</h2>
              <p className="text-hti-yellow mb-4 font-medium">
                Executive summary with impact metrics, trends, and key insights for board members.
              </p>
              <div className="flex items-center text-sm font-bold text-hti-yellow">
                <span>View Dashboard</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <div className="absolute inset-0 bg-hti-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Ops Dashboard Card */}
          <Link
            href="/ops"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-hti-red to-hti-orange p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[300px] flex flex-col border-2 border-hti-yellow/30"
          >
            <div className="relative z-10 text-white">
              <div className="text-5xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold mb-3 text-white">Operations Hub</h2>
              <p className="text-hti-yellow mb-4 font-medium">
                Mission control for inventory, donations, distributions, and training management.
              </p>
              <div className="flex items-center text-sm font-bold text-hti-yellow">
                <span>Launch Hub</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <div className="absolute inset-0 bg-hti-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Reports Dashboard Card */}
          <Link
            href="/reports"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-hti-orange to-hti-red p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[300px] flex flex-col border-2 border-hti-yellow/30"
          >
            <div className="relative z-10 text-white">
              <div className="text-4xl mb-4">📄</div>
              <h2 className="text-2xl font-bold mb-3 text-white">Grant Reports</h2>
              <p className="text-hti-yellow mb-4 font-medium">
                Generate quarterly reports, track grant goals, and export data for NCDIT compliance.
              </p>
              <div className="flex items-center text-sm font-bold text-hti-yellow">
                <span>Generate Reports</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Marketing Hub Card */}
          <Link
            href="/marketing"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[300px] flex flex-col"
          >
            <div className="relative z-10 text-white">
              <div className="text-4xl mb-4">📣</div>
              <h2 className="text-2xl font-bold mb-3 text-white">Marketing Hub</h2>
              <p className="text-white mb-4">
                Recipient stories, impact quotes, and partnership applications for marketing campaigns.
              </p>
              <div className="flex items-center text-sm font-medium text-white">
                <span>View Stories</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>HUBZone Technology Initiative • Henderson, NC</p>
          <p className="mt-1">
            <a
              href="https://hubzonetech.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hti-teal hover:underline"
            >
              hubzonetech.org
            </a>
          </p>
          <p className="mt-4 text-xs text-gray-600">
            Powered by Knack • Real-time data from HTI's database
          </p>
        </div>
      </div>
    </div>
  );
}
