"use client";

import { useMemo } from "react";
import { TrendingUp, ShieldCheck, Zap, Calendar } from "lucide-react";
import { useMetrics } from "@/lib/hooks/useMetrics";

function formatNumber(value: number | undefined, fallback = "—") {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return new Intl.NumberFormat("en-US").format(value);
}

export default function BoardPulse() {
  const { data } = useMetrics();

  const pulse = useMemo(() => {
    if (!data) {
      return {
        progress: "Grant metrics syncing...",
        pipeline: "Pipeline snapshot loading...",
        readiness: "Upcoming delivery checklist building...",
        cadence: "Board schedule syncing...",
      };
    }

    const progress = `${data.grantLaptopProgress ?? 0}% of laptops delivered (${formatNumber(data.grantLaptopsPresented)} / ${formatNumber(data.grantLaptopGoal)})`;
    const pipeline = `${formatNumber(data.inPipeline)} devices in motion • ${formatNumber(data.pipeline?.ready)} ready for QA`;
    const readiness = `${formatNumber(data.pipeline?.dataWipe)} awaiting data wipe • ${formatNumber(data.pipeline?.refurbishing)} in refurb • ${formatNumber(data.pipeline?.qaTesting)} in QA`;
    const cadence = `Next milestone: ${formatNumber(data.partnerOrganizations)} partner orgs engaged • ${formatNumber(data.countiesServed)} counties active`;

    return { progress, pipeline, readiness, cadence };
  }, [data]);

  return (
    <div className="glass-card glass-card--subtle shadow-glass border border-white/25 h-full">
      <div className="glass-card__glow bg-gradient-to-br from-hti-teal/25 via-hti-plum/20 to-hti-navy/25" />
      <div className="relative p-6 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-glass-muted">Board pulse</p>
          <h3 className="text-2xl font-bold text-glass-bright">What the numbers are telling us</h3>
        </header>

        <div className="space-y-4 text-sm text-glass-bright">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-4.5 h-4.5 text-hti-yellow mt-0.5" />
            <div>
              <p className="font-semibold">Grant Momentum</p>
              <p className="text-glass-muted">{pulse.progress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Zap className="w-4.5 h-4.5 text-hti-ember mt-0.5" />
            <div>
              <p className="font-semibold">Pipeline Velocity</p>
              <p className="text-glass-muted">{pulse.pipeline}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4.5 h-4.5 text-hti-teal mt-0.5" />
            <div>
              <p className="font-semibold">Delivery Readiness</p>
              <p className="text-glass-muted">{pulse.readiness}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4.5 h-4.5 text-hti-plum mt-0.5" />
            <div>
              <p className="font-semibold">Engagement Cadence</p>
              <p className="text-glass-muted">{pulse.cadence}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/12 border border-white/20 p-4 text-xs text-glass-muted leading-relaxed">
          HUBDash refreshes these indicators every few minutes. Upcoming board meeting materials generate from this snapshot automatically.
        </div>
      </div>
    </div>
  );
}

