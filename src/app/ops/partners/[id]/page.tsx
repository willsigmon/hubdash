import Link from "next/link";
import PartnerDetailClient from "@/components/ops/PartnerDetailClient";

interface PartnerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-sand/60 via-white to-hti-sand/40">
      {/* Header Navigation */}
      <header className="relative overflow-hidden bg-gradient-to-r from-hti-navy via-hti-navy/95 to-hti-navy text-white shadow-xl">
        <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(circle_at_top_right,_rgba(109,179,183,0.35),_transparent_60%)]" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/ops"
                className="glass-button glass-button--accent text-sm font-semibold shadow-glass hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                ← Back to Operations
              </Link>
              <span className="text-white/40">•</span>
              <h1 className="text-2xl font-bold text-white">Partner Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PartnerDetailClient partnerId={resolvedParams.id} />
      </main>
    </div>
  );
}
