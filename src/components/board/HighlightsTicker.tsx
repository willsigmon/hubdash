"use client";

import { useMemo } from "react";
import { useMetrics } from "@/lib/hooks/useMetrics";

function formatNumber(value: number | undefined, fallback = "0") {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export default function HighlightsTicker() {
  const { data, isLoading, isError } = useMetrics();

  const highlights = useMemo(() => {
    if (!data) {
      return [
        "HUBDash live metrics syncing...",
        "Grant laptop goal: 1,500 devices",
        "Digital Champion expansion across 15+ counties",
      ];
    }

    const progress = data.grantLaptopProgress ?? 0;
    const ready = data.pipeline?.ready ?? 0;
    const pipeline = data.inPipeline ?? 0;
    const distributed = data.totalChromebooksDistributed ?? 0;
    const partners = data.partnerOrganizations ?? 0;

    return [
      `🎯 ${progress}% of grant laptop goal achieved (${formatNumber(data.grantLaptopsPresented)} of ${formatNumber(data.grantLaptopGoal)})`,
      `🚚 ${formatNumber(distributed)} Chromebooks delivered statewide — next drops ready: ${formatNumber(ready)}`,
      `🤝 ${formatNumber(partners)} partner organizations collaborating across ${formatNumber(data.countiesServed)} counties`,
      `🛠️ ${formatNumber(pipeline)} devices moving through refurbishment pipeline right now`,
      `📈 Grant training target: ${formatNumber(data.grantTrainingHoursGoal)} hours — HUBDash tracking live attainment`,
    ];
  }, [data]);

  if (isError) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/35 shadow-glass bg-gradient-to-r from-hti-navy/12 via-white/40 to-hti-teal/20 px-6 py-3 backdrop-blur">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-hti-sand/90 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-hti-sand/90 to-transparent pointer-events-none" />
      <div className="board-ticker-container">
        <div className="board-ticker-track">
          {(isLoading ? highlights.slice(0, 3) : highlights).map((message, index) => (
            <span key={`ticker-${index}`} className="board-ticker-chip">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

