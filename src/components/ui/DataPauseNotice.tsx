"use client";

import { ReactNode } from "react";

type Tone = "info" | "warning";

interface DataPauseNoticeProps {
  icon?: ReactNode;
  tone?: Tone;
  title: string;
  message: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const toneClasses: Record<Tone, { wrapper: string; badge: string }> = {
  info: {
    wrapper: "from-hti-teal/18 via-hti-navy/18 to-hti-navy/30",
    badge: "bg-hti-teal/25 text-hti-teal border border-hti-teal/40",
  },
  warning: {
    wrapper: "from-hti-yellow/22 via-hti-orange/15 to-hti-navy/20",
    badge: "bg-hti-yellow/25 text-hti-orange border border-hti-yellow/40",
  },
};

export default function DataPauseNotice({
  icon,
  tone = "warning",
  title,
  message,
  detail,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: DataPauseNoticeProps) {
  const toneStyle = toneClasses[tone];

  return (
    <div className="relative max-w-xl mx-auto">
      <div className={`glass-card glass-card--subtle shadow-[0_28px_60px_rgba(12,24,48,0.45)] border border-white/18 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${toneStyle.wrapper}`} />
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.3),transparent_55%)]" />

        <div className="relative z-10 px-6 py-8 md:px-8 md:py-10 space-y-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] ${toneStyle.badge}`}>
              HUBDash notice
            </span>
            {icon && <div className="text-4xl">{icon}</div>}
            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-[0_12px_24px_rgba(10,18,34,0.45)]">
              {title}
            </h3>
            <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-md">
              {message}
            </p>
            {detail && (
              <p className="text-xs md:text-sm text-white/70 leading-relaxed max-w-md">
                {detail}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="glass-button glass-button--accent text-xs md:text-sm"
              >
                {actionLabel}
              </button>
            )}
            {secondaryLabel && onSecondary && (
              <button
                type="button"
                onClick={onSecondary}
                className="glass-button text-xs md:text-sm"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
