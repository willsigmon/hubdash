"use client";

import { useEffect, useMemo, useState, type JSX } from "react";
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";
import type { SocialFeedResponse, SocialPlatformResult, SocialPost } from "@/lib/social/types";

type PlatformMeta = {
  label: string;
  icon: JSX.Element;
  badge: string;
  iconRing: string;
  cardAccent: string;
  gradient: string;
  backdrop: string;
};

const platformMeta: Record<SocialPost["platform"], PlatformMeta> = {
  facebook: {
    label: "Facebook",
    icon: <Facebook className="w-5 h-5 text-[#1778f2]" />,
    badge: "inline-flex items-center gap-1 rounded-full bg-[#172554]/30 px-3 py-1 border border-[#3b82f6]/40 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93c5fd] shadow-[0_8px_18px_rgba(23,120,242,0.25)]",
    iconRing: "from-[#1778f2]/50 via-[#1d3559]/30 to-transparent",
    cardAccent: "hover:border-[#1778f2]/45",
    gradient: "from-[#172554]/90 via-[#0f172a]/85 to-[#0b1120]/90",
    backdrop: "bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.32),transparent_55%)]",
  },
  instagram: {
    label: "Instagram",
    icon: <Instagram className="w-5 h-5 text-[#e1306c]" />,
    badge: "inline-flex items-center gap-1 rounded-full bg-[#3d1044]/40 px-3 py-1 border border-[#f472b6]/45 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f9a8d4] shadow-[0_8px_18px_rgba(225,48,108,0.25)]",
    iconRing: "from-[#f472b6]/50 via-[#581c87]/25 to-transparent",
    cardAccent: "hover:border-[#e1306c]/35",
    gradient: "from-[#3d1044]/85 via-[#2d0a3c]/80 to-[#13041e]/88",
    backdrop: "bg-[radial-gradient(circle_at_top_right,_rgba(249,168,212,0.35),transparent_55%)]",
  },
  linkedin: {
    label: "LinkedIn",
    icon: <Linkedin className="w-5 h-5 text-[#0a66c2]" />,
    badge: "inline-flex items-center gap-1 rounded-full bg-[#0a2a50]/30 px-3 py-1 border border-[#38bdf8]/45 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#93e5ff] shadow-[0_8px_18px_rgba(10,102,194,0.25)]",
    iconRing: "from-[#38bdf8]/50 via-[#1e3a8a]/30 to-transparent",
    cardAccent: "hover:border-[#0a66c2]/40",
    gradient: "from-[#0b1f3a]/88 via-[#0f284c]/85 to-[#0a172d]/90",
    backdrop: "bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.32),transparent_55%)]",
  },
  tiktok: {
    label: "TikTok",
    icon: <Music2 className="w-5 h-5 text-[#69c9d0]" />,
    badge: "inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 border border-white/15 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_8px_18px_rgba(15,23,42,0.35)]",
    iconRing: "from-[#69c9d0]/45 via-[#111827]/45 to-transparent",
    cardAccent: "hover:border-white/25",
    gradient: "from-[#0f172a]/88 via-[#020617]/88 to-[#020617]/95",
    backdrop: "bg-[radial-gradient(circle_at_center,_rgba(105,201,208,0.35),transparent_55%)]",
  },
};

function formatRelativeTime(timestamp: string): string {
  const target = new Date(timestamp);
  const now = Date.now();
  const diffMinutes = Math.round((target.getTime() - now) / (1000 * 60));

  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: "minute" },
    { amount: 60, unit: "hour" },
    { amount: 24, unit: "day" },
    { amount: 7, unit: "week" },
    { amount: 4.34524, unit: "month" },
    { amount: 12, unit: "year" },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = diffMinutes;
  let chosenUnit: Intl.RelativeTimeFormatUnit = "minute";

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      chosenUnit = division.unit;
      break;
    }
    duration /= division.amount;
    chosenUnit = division.unit;
  }

  return rtf.format(Math.round(duration), chosenUnit);
}

export default function RecentActivity() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [platformStatuses, setPlatformStatuses] = useState<SocialPlatformResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSocial() {
      try {
        const response = await fetch("/api/social", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const payload = (await response.json()) as SocialFeedResponse;
        if (!mounted) return;
        setPosts(payload.posts || []);
        setPlatformStatuses(payload.platforms || []);
      } catch (err) {
        console.error("Error loading social posts:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load social posts");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSocial();
    return () => {
      mounted = false;
    };
  }, []);

  const displayedPosts = useMemo(() => posts.slice(0, 4), [posts]);
  const emptyCardCount = Math.max(0, 4 - displayedPosts.length);

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden flex flex-col border border-white/12 rounded-3xl">
      <div className="relative p-7 md:p-9 bg-gradient-to-br from-hti-navy via-[#1d3152] to-[#0d1a33]">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),transparent_55%)]" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
            HubDash Signals
          </span>
          <div className="space-y-3">
            <h3 className="text-[2.25rem] md:text-[2.6rem] font-bold text-white drop-shadow-[0_12px_28px_rgba(8,18,34,0.55)]">
              Community Buzz
            </h3>
            <p className="text-base md:text-lg text-white/80">
              Fresh highlights from HTI social channels—perfect for quick scan-and-share moments.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-7 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 animate-pulse">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-[28px] border border-white/10 bg-white/5 h-56" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-hti-yellow bg-white/5 rounded-2xl border border-hti-yellow/30">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-semibold">We couldn’t load social posts.</p>
            <p className="text-sm text-glass-muted mt-2">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-glass-muted bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No recent social posts detected</p>
            <p className="text-xs text-glass-muted opacity-80 mt-2">
              Add platform credentials to stream live updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {displayedPosts.map((post, index) => {
              const meta = platformMeta[post.platform];
              return (
                <article
                  key={`${post.platform}-${post.id}`}
                  className={`relative grid min-h-[260px] overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-br ${meta.gradient} backdrop-blur-xl transition-all duration-300 focus-within:shadow-[0_32px_60px_rgba(10,18,34,0.55)] hover:shadow-[0_38px_70px_rgba(10,18,34,0.6)] ${meta.cardAccent}`}
                >
                  <div className={`absolute inset-0 opacity-70 ${meta.backdrop}`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-transparent" />

                  <div className="relative z-10 grid gap-6 lg:grid-cols-[1.5fr,1fr] p-6">
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 blur-xl opacity-70 bg-gradient-to-br from-white/40 to-transparent" aria-hidden />
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/40 shadow-[0_14px_32px_rgba(10,18,34,0.5)]">
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${meta.iconRing} opacity-80`} />
                            <div className="relative z-10 text-white">{meta.icon}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className={meta.badge}>{meta.label}</span>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/70">
                            {post.author && <span className="font-semibold text-white/88">{post.author}</span>}
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden />
                              <time dateTime={post.publishedAt}>{formatRelativeTime(post.publishedAt)}</time>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-base md:text-lg leading-relaxed text-white/90">
                        {post.message || "(No caption provided)"}
                      </p>

                      <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75">
                        <span className="h-1.5 w-1.5 rounded-full bg-hti-teal/80" aria-hidden />
                        Spotlight {index + 1}
                      </div>
                    </div>

                    <div className="rounded-3xl overflow-hidden border border-white/15 bg-black/40 min-h-[160px] flex items-center justify-center">
                      {post.mediaUrl ? (
                        <img
                          src={post.mediaUrl}
                          alt={`${meta.label} post media`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl text-white/25">
                          {meta.icon}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-white/65 lg:col-span-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                        Board ready
                      </span>
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 transition-all hover:bg-white/24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hti-teal/40"
                      >
                        View post
                        <span aria-hidden>↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}

            {Array.from({ length: emptyCardCount }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="rounded-[28px] border border-dashed border-white/20 bg-gradient-to-br from-white/12 to-white/4 p-6 flex flex-col justify-between gap-6 text-hti-navy"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-hti-navy">
                    Slot available
                  </span>
                  <h4 className="text-lg font-semibold text-hti-navy">Connect another social channel</h4>
                  <p className="text-sm text-hti-navy/70 leading-relaxed">
                    Authenticate a new platform to surface fresh impact stories directly on the board dashboard.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-hti-teal/15 border border-hti-teal/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-hti-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-hti-teal" aria-hidden />
                  Ready to connect
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 bg-gradient-to-r from-white/10 via-transparent to-white/10">
        <p className="text-xs md:text-sm text-white/70">
          Want deeper storytelling assets? Jump into the Marketing HUB for long-form posts, quotes, and ready-to-export shareables.
        </p>
      </div>
    </div>
  );
}
