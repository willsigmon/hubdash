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
    <div className="min-h-screen bg-gradient-to-br from-hti-yellow/5 via-white to-hti-orange/5">
      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-hti-yellow to-hti-orange shadow-lg border-b-4 border-hti-red">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/ops"
                className="text-hti-navy hover:text-hti-red transition-colors font-bold"
              >
                ← Back to Ops
              </Link>
              <span className="text-hti-navy/40">•</span>
              <h1 className="text-2xl font-bold text-hti-navy">Partner Profile</h1>
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
