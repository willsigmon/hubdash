import Link from "next/link";
import PartnerDetailClient from "@/components/ops/PartnerDetailClient";

interface PartnerDetailPageProps {
  params: {
    id: string;
  };
}

export default function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  return (
    <div className="min-h-screen bg-app">
      {/* Header Navigation */}
      <header className="accent-gradient text-on-accent shadow-lg border-b border-default">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/ops"
                className="font-bold transition-colors text-on-accent hover:text-highlight"
              >
                ← Back to Ops
              </Link>
              <span className="text-on-accent opacity-70">•</span>
              <h1 className="text-2xl font-bold text-on-accent">Partner Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PartnerDetailClient partnerId={params.id} />
      </main>
    </div>
  );
}
