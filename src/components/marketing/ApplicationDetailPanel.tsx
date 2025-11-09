"use client";

import { Partnership } from "@/types/partnership";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  Mail,
  MapPin,
  Quote,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface ApplicationDetailPanelProps {
  application: Partnership;
  onClose: () => void;
  onAction?: (action: string, applicationId: string) => void;
}

export default function ApplicationDetailPanel({
  application,
  onClose,
  onAction,
}: ApplicationDetailPanelProps) {
  // Accessibility: focus trap within the dialog and ESC to close
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useMemo(() => `app-detail-title-${application.id}`, [application.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-soft-success text-success border-success/40";
      case "Pending":
        return "bg-soft-warning text-warning border-warning/40";
      case "In Review":
        return "bg-soft-accent text-accent border-accent/40";
      case "Rejected":
        return "bg-soft-danger text-danger border-danger/40";
      default:
        return "bg-surface-alt text-secondary border-default";
    }
  };

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !panelRef.current.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
      {children}
    </span>
  );

  const Badge = ({
    className = "",
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <span
      className={`rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );

  const Section = ({
    icon: Icon,
    title,
    children,
    tone = "default",
  }: {
    icon: any;
    title: string;
    children: React.ReactNode;
    tone?: "default" | "accent" | "muted";
  }) => {
    const backgrounds = {
      default: "bg-surface border-default",
      accent: "bg-soft-accent border-accent/40",
      muted: "bg-surface-alt border-default",
    } as const;

    return (
      <section
        className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
          backgrounds[tone]
        }`}
      >
        <header className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-soft-accent p-3 text-accent shadow-sm">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold text-primary">{title}</h3>
        </header>
        <div className="space-y-3">{children}</div>
      </section>
    );
  };

  const Row = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string;
    value: any;
    fullWidth?: boolean;
  }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="mb-1 text-[11px] font-bold uppercase tracking-wide text-secondary">
          {label}
        </dt>
        <dd className="text-sm font-medium text-primary">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1.5">
              {value.map((item, idx) => (
                <Badge key={idx} className="border-accent/40 bg-soft-accent text-accent">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="whitespace-pre-wrap break-words">{value}</span>
          )}
        </dd>
      </div>
    );
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        className="my-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-default bg-surface shadow-[0_20px_80px_rgba(12,27,51,0.4)] animate-in fade-in duration-200"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-default bg-gradient-to-br from-hti-navy via-hti-navy-dark to-hti-navy">
          <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-hti-gold/20 blur-3xl" />
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative px-8 py-8 text-white sm:px-10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                  {application.is501c3 && (
                    <Badge className="border-success/40 bg-soft-success text-success">✓ 501(c)(3)</Badge>
                  )}
                  {application.firstTime && (
                    <Badge className="border-white/40 bg-white/10 text-white">First-time Applicant</Badge>
                  )}
                </div>
                <h2
                  id={titleId}
                  className="text-3xl font-bold leading-tight sm:text-4xl"
                >
                  {application.organizationName}
                </h2>
                <p className="max-w-2xl text-sm text-white/80">
                  {application.positiveImpact ||
                    "This organization is ready to expand digital access and community outcomes with HTI Chromebooks."}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>
                    <CalendarDays className="mr-1.5 inline-block h-3.5 w-3.5" />
                    {new Date(application.timestamp).toLocaleDateString()}
                  </Chip>
                  <Chip>
                    <MapPin className="mr-1.5 inline-block h-3.5 w-3.5" />
                    {application.county ? `${application.county} County, NC` : "Across North Carolina"}
                  </Chip>
                  <Chip>
                    <Users className="mr-1.5 inline-block h-3.5 w-3.5" />
                    {application.chromebooksNeeded} requested
                  </Chip>
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={onClose}
                className="rounded-full border border-white/20 p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Story Stage
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {application.status === "Approved"
                    ? "Ready for spotlight"
                    : application.status === "Pending"
                    ? "Marketing review needed"
                    : application.status}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Contact
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{application.contactPerson}</p>
                <p className="text-sm text-white/70">{application.email}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Applicant Type
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {application.firstTime ? "First-time partner" : "Returning partner"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Preferred Follow-up
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {application.preferredContactMethod || "Email"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto bg-surface px-6 py-8 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <Section icon={Mail} title="Contact Information">
                <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Row label="Contact Person" value={application.contactPerson} />
                  <Row label="Email" value={application.email} />
                  <Row label="Phone" value={application.phone} />
                  <Row label="Preferred Contact" value={application.preferredContactMethod} />
                  <Row label="Address" value={application.address} fullWidth />
                  <Row label="Website" value={application.website} />
                </dl>
              </Section>

              <Section icon={Building2} title="Organization Snapshot" tone="muted">
                <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Row label="Organization Type" value={application.organizationType} />
                  <Row label="County" value={application.county} />
                  <Row label="501(c)(3)" value={application.is501c3 ? "Yes ✓" : "No"} />
                  <Row
                    label="First-time Applicant"
                    value={application.firstTime ? "Yes" : "Returning"}
                  />
                  <Row label="How They Heard About HTI" value={application.howHeard} fullWidth />
                </dl>
              </Section>

              <Section icon={Users} title="Client Stories & Needs">
                <dl className="grid grid-cols-1 gap-4">
                  <Row label="Communities Served" value={application.workssWith} fullWidth />
                  <Row
                    label="Challenges They're Addressing"
                    value={application.clientStruggles}
                    fullWidth
                  />
                  <Row label="Client Goals" value={application.clientGoals} fullWidth />
                </dl>
              </Section>

              <Section icon={Lightbulb} title="How They'll Use Chromebooks">
                <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Row label="Devices Requested" value={application.chromebooksNeeded} />
                  <Row
                    label="How Clients Use Devices"
                    value={application.howClientsUseLaptops}
                    fullWidth
                  />
                  <Row
                    label="Program & Training Plans"
                    value={application.howWillUse}
                    fullWidth
                  />
                </dl>
              </Section>

              <Section icon={TrendingUp} title="Impact Momentum" tone="muted">
                <dl className="grid grid-cols-1 gap-4">
                  <Row label="Positive Impact Expected" value={application.positiveImpact} fullWidth />
                  <Row
                    label="Expected Outcomes"
                    value={application.whatClientsAchieve}
                    fullWidth
                  />
                  <Row
                    label="Relationship Continuation"
                    value={application.howToContinueRelationship}
                    fullWidth
                  />
                </dl>
              </Section>

              {(application.quote || application.oneWord) && (
                <Section icon={Quote} title="Ready-to-Share Quotes" tone="accent">
                  <dl className="grid grid-cols-1 gap-4">
                    {application.quote && (
                      <div className="rounded-2xl border border-accent/40 bg-white/80 p-5 shadow-sm">
                        <p className="text-base font-semibold leading-relaxed text-primary">
                          “{application.quote}”
                        </p>
                      </div>
                    )}
                    <Row label="In One Word" value={application.oneWord} />
                  </dl>
                </Section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-default bg-surface-alt p-6 shadow-md">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Story cues
                </h3>
                <p className="mt-2 text-sm text-secondary">
                  Quick cues for social captions, quote card copy, and pitch decks.
                </p>
                <ul className="mt-4 space-y-4 text-sm text-primary">
                  {application.clientGoals && (
                    <li className="rounded-xl bg-white/70 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        DREAM
                      </p>
                      <p className="mt-1">{application.clientGoals}</p>
                    </li>
                  )}
                  {application.positiveImpact && (
                    <li className="rounded-xl bg-white/70 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        IMPACT
                      </p>
                      <p className="mt-1">{application.positiveImpact}</p>
                    </li>
                  )}
                  {application.howClientsUseLaptops && (
                    <li className="rounded-xl bg-white/70 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        ON THE GROUND
                      </p>
                      <p className="mt-1">{application.howClientsUseLaptops}</p>
                    </li>
                  )}
                </ul>
              </div>

              {(application.notes || application.internalComments) && (
                <section className="rounded-3xl border border-danger/40 bg-soft-danger p-6">
                  <header className="mb-3 flex items-center gap-3">
                    <span className="rounded-lg bg-danger/10 p-2 text-danger">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-danger">
                      Internal Notes
                    </h3>
                  </header>
                  <dl className="space-y-4 text-sm text-primary">
                    <Row label="Notes" value={application.notes} fullWidth />
                    <Row label="Comments" value={application.internalComments} fullWidth />
                  </dl>
                </section>
              )}

              <div className="rounded-3xl border border-default bg-surface p-6 shadow-md">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Next moves
                </h3>
                <p className="mt-2 text-sm text-secondary">
                  Trigger storytelling assets right from this panel.
                </p>
                <div className="mt-4 grid gap-3">
                  <button
                    aria-label="Approve application"
                    onClick={() => onAction?.("approve", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-success/40 bg-soft-success px-4 py-3 text-sm font-semibold text-success transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-success/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve for spotlight
                  </button>
                  <button
                    aria-label="Request more info"
                    onClick={() => onAction?.("request-info", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-soft-accent px-4 py-3 text-sm font-semibold text-accent transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
                  >
                    Request more info
                  </button>
                  <button
                    aria-label="Schedule"
                    onClick={() => onAction?.("schedule", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-default bg-surface px-4 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-strong hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-hti-gold/40"
                  >
                    Schedule delivery touchpoint
                  </button>
                  <button
                    aria-label="Mark contacted"
                    onClick={() => onAction?.("contact", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-warning/40 bg-soft-warning px-4 py-3 text-sm font-semibold text-warning transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-warning/30"
                  >
                    Mark as contacted
                  </button>
                  <button
                    aria-label="Generate quote card"
                    onClick={() => onAction?.("quote-card", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-hti-orange to-hti-gold px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-hti-gold/40"
                  >
                    Generate quote card
                  </button>
                  <button
                    aria-label="Export PDF"
                    onClick={() => onAction?.("export", application.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-danger/40 bg-soft-danger px-4 py-3 text-sm font-semibold text-danger transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-danger/30"
                  >
                    Export story PDF
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
