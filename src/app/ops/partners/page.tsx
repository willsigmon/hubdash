import RecipientOrganizations from "@/components/ops/RecipientOrganizations";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hti-navy via-hti-gray to-hti-navy/90 p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/ops"
          className="inline-flex items-center gap-2 text-hti-yellow hover:text-hti-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Operations
        </Link>

        <RecipientOrganizations />
      </div>
    </div>
  );
}
