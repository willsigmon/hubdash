"use client";

import { useEffect, useMemo, useState, type JSX } from "react";
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";
import type { SocialFeedResponse, SocialPlatformResult, SocialPost } from "@/lib/social/types";

type PlatformMeta = {
  label: string;
  icon: JSX.Element;
  badge: string;
  accent: string;
};

const platformMeta: Record<SocialPost["platform"], PlatformMeta> = {
  facebook: {
    label: "Facebook",
    icon: <Facebook className="w-5 h-5 text-[#1778f2]" />,
    badge: "glass-chip glass-chip--slate border border-[#1778f2]/35 text-[#1778f2]",
    accent: "bg-[#1778f2]/15 border border-[#1778f2]/30",
  },
  instagram: {
    label: "Instagram",
    icon: <Instagram className="w-5 h-5 text-[#e1306c]" />,
    badge: "glass-chip glass-chip--orange border border-white/30",
    accent: "bg-[#e1306c]/15 border border-white/20",
  },
  linkedin: {
    label: "LinkedIn",
    icon: <Linkedin className="w-5 h-5 text-[#0a66c2]" />,
    badge: "glass-chip glass-chip--teal border border-white/30",
    accent: "bg-[#0a66c2]/15 border border-white/20",
  },
  tiktok: {
    label: "TikTok",
    icon: <Music2 className="w-5 h-5 text-[#69c9d0]" />,
    badge: "glass-chip glass-chip--slate border border-white/25",
    accent: "bg-black/30 border border-white/15",
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

  const statusBadges = useMemo(() => {
    if (platformStatuses.length === 0) {
      return (Object.keys(platformMeta) as Array<SocialPost["platform"]>).map((platform) => ({
        platform,
        status: "unconfigured" as const,
        posts: [],
      }));
    }
    return platformStatuses;
  }, [platformStatuses]);

  return (
    <div className="glass-card glass-card--subtle shadow-glass overflow-hidden flex flex-col">
      <div className="p-6 glass-divider">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-glass-bright flex items-center gap-2 mb-1">
              🚀 Recent Activity
            </h3>
            <p className="text-sm text-glass-muted font-medium">
              Signals from Facebook, Instagram, LinkedIn, and TikTok
            </p>
          </div>
          <div className="text-xs text-glass-muted font-semibold uppercase tracking-wide">
            {loading ? "Loading" : `Updated ${new Date().toLocaleTimeString()}`}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-white/8">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/5" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-hti-yellow">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-semibold">We couldn’t load social posts.</p>
            <p className="text-sm text-glass-muted mt-2">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-glass-muted">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No recent social posts detected</p>
            <p className="text-xs text-glass-muted opacity-80 mt-2">
              Add platform credentials to stream live updates.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const meta = platformMeta[post.platform];
            return (
              <article
                key={`${post.platform}-${post.id}`}
                className="p-6 transition-all hover:bg-white/8 focus-within:bg-white/10 border-l-4 border-l-transparent hover:border-l-hti-teal/70"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${meta.accent} w-12 h-12 rounded-xl flex items-center justify-center shadow-md`}
                    aria-hidden="true"
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <header className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`${meta.badge} text-xs font-semibold tracking-wide`}>{meta.label}</span>
                          <time className="text-xs text-glass-muted font-semibold">
                            {formatRelativeTime(post.publishedAt)}
                          </time>
                        </div>
                        {post.author && (
                          <p className="text-xs text-glass-muted opacity-80 mt-1">{post.author}</p>
                        )}
                      </div>
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-chip glass-chip--slate text-xs hover:scale-105 transition-transform"
                      >
                        View post ↗
                      </a>
                    </header>
                    <p className="text-sm text-glass-bright leading-relaxed break-words">
                      {post.message || "(No caption provided)"}
                    </p>
                    {post.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/10 shadow-inner max-h-60">
                        <img
                          src={post.mediaUrl}
                          alt={`${meta.label} media preview`}
                          className="w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="p-4 glass-divider space-y-3 text-xs text-glass-muted">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-glass-bright">Platform status:</span>
          {statusBadges.map((status) => {
            const meta = platformMeta[status.platform];
            const stateLabel =
              status.status === "ok"
                ? "Live"
                : status.status === "unconfigured"
                ? "Connect"
                : "Check";
            const tone =
              status.status === "ok"
                ? "glass-chip glass-chip--teal"
                : status.status === "unconfigured"
                ? "glass-chip glass-chip--slate"
                : "glass-chip glass-chip--yellow";

            return (
              <span key={status.platform} className={`${tone} text-[10px] tracking-wide uppercase`}>
                {meta.label}: {stateLabel}
              </span>
            );
          })}
        </div>
        <p className="leading-relaxed">
          Configure social API credentials in <code>.env.local</code> to replace fallback samples with live posts.
        </p>
      </div>
    </div>
  );
}
