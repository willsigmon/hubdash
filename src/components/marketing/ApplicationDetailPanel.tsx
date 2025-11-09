"use client";

import { Partnership } from "@/types/partnership";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Lightbulb,
  Mail,
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

export default function ApplicationDetailPanel({ application, onClose, onAction }: ApplicationDetailPanelProps) {
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
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
      {children}
    </span>
  );

  const Badge = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${className}`}>{children}</span>
  );

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <section className="bg-surface rounded-xl border border-default p-5">
      <header className="flex items-center gap-3 mb-4">
        <span className="p-2 accent-gradient rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </span>
        <h3 className="font-semibold text-primary text-base">{title}</h3>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const Row = ({ label, value, fullWidth = false }: { label: string; value: any; fullWidth?: boolean }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="text-[11px] font-bold text-secondary uppercase tracking-wide mb-1">{label}</dt>
        <dd className="text-sm text-primary font-medium">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1.5">
              {value.map((item, idx) => (
                <Badge key={idx} className="bg-soft-accent text-accent border-accent/40">
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        className="bg-surface rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-default animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-default bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-2xl md:text-3xl font-bold text-primary truncate">
                {application.organizationName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                {application.is501c3 && (
                  <Badge className="bg-soft-success text-success border-success/40">✓ 501(c)(3)</Badge>
                )}
                {application.firstTime && (
                  <Badge className="bg-white/10 text-white border-white/30">First-time Applicant</Badge>
                )}
                <div className="ml-2 hidden md:flex items-center gap-2">
                  <Chip>{new Date(application.timestamp).toLocaleDateString()}</Chip>
                  <Chip>{application.county || "Unknown"}</Chip>
                  <Chip>{application.chromebooksNeeded} requested</Chip>
                </div>
              </div>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-alt border border-transparent hover:border-default text-secondary hover:text-primary focus-ring"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-260px)] overflow-y-auto">
          {/* Contact Information */}
          <Section icon={Mail} title="Contact Information">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Row label="Contact Person" value={application.contactPerson} />
              <Row label="Email" value={application.email} />
              <Row label="Phone" value={application.phone} />
              <Row label="Preferred Contact" value={application.preferredContactMethod} />
              <Row label="Address" value={application.address} fullWidth />
              <Row label="Website" value={application.website} />
            </dl>
          </Section>

          {/* Organization Details */}
          <Section icon={Building2} title="Organization Details">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Row label="Organization Type" value={application.organizationType} />
              <Row label="County" value={application.county} />
              <Row label="501(c)(3)" value={application.is501c3 ? "Yes ✓" : "No"} />
              <Row label="First-time Applicant" value={application.firstTime ? "Yes" : "Returning"} />
              <Row label="How They Heard About HTI" value={application.howHeard} fullWidth />
            </dl>
          </Section>

          {/* Client Population */}
          <Section icon={Users} title="Client Population & Needs">
            <dl className="grid grid-cols-1 gap-4">
              <Row label="Works With" value={application.workssWith} fullWidth />
              <Row label="Client Struggles Being Addressed" value={application.clientStruggles} fullWidth />
              <Row label="Client Goals" value={application.clientGoals} fullWidth />
            </dl>
          </Section>

          {/* How They'll Use Chromebooks */}
          <Section icon={Lightbulb} title="How They'll Use Chromebooks">
            <dl className="grid grid-cols-1 gap-4">
              <Row label="Chromebooks Requested" value={application.chromebooksNeeded} />
              <Row label="How They'll Use Them" value={application.howWillUse} fullWidth />
              <Row label="How Clients Will Use Laptops" value={application.howClientsUseLaptops} fullWidth />
            </dl>
          </Section>

          {/* Expected Impact */}
          <Section icon={TrendingUp} title="Expected Impact">
            <dl className="grid grid-cols-1 gap-4">
              <Row label="Positive Impact Expected" value={application.positiveImpact} fullWidth />
              <Row label="What Clients Will Achieve" value={application.whatClientsAchieve} fullWidth />
              <Row label="How to Continue Relationship" value={application.howToContinueRelationship} fullWidth />
            </dl>
          </Section>

          {/* Marketing Assets */}
          {(application.quote || application.oneWord) && (
            <Section icon={Target} title="Marketing Assets">
              <dl className="grid grid-cols-1 gap-4">
                {application.quote && (
                  <div className="p-4 rounded-lg border-l-4 border-accent bg-soft-accent">
                    <p className="text-primary italic text-base leading-relaxed font-semibold">“{application.quote}”</p>
                  </div>
                )}
                <Row label="In One Word" value={application.oneWord} />
              </dl>
            </Section>
          )}

          {/* Internal Notes */}
          {(application.notes || application.internalComments) && (
            <section className="bg-surface rounded-xl p-5 border border-danger/30">
              <header className="flex items-center gap-3 mb-3">
                <span className="p-2 bg-soft-danger rounded-md">
                  <AlertCircle className="w-4 h-4 text-danger" />
                </span>
                <h3 className="font-semibold text-primary text-base">Internal Notes</h3>
              </header>
              <dl className="grid grid-cols-1 gap-4">
                <Row label="Notes" value={application.notes} fullWidth />
                <Row label="Comments" value={application.internalComments} fullWidth />
              </dl>
            </section>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 z-10 bg-surface-alt/90 backdrop-blur px-6 py-4 border-t border-default">
          <div className="flex flex-wrap items-center gap-2">
            <button
              aria-label="Approve application"
              onClick={() => onAction?.("approve", application.id)}
              className="px-4 py-2 bg-soft-success text-success hover:bg-soft-success rounded-lg font-bold text-sm focus-ring border border-success/30"
            >
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Approve</span>
            </button>
            <button
              aria-label="Request more info"
              onClick={() => onAction?.("request-info", application.id)}
              className="px-4 py-2 bg-soft-accent text-accent rounded-lg font-bold text-sm focus-ring border border-accent/40"
            >
              More Info
            </button>
            <button
              aria-label="Schedule"
              onClick={() => onAction?.("schedule", application.id)}
              className="px-4 py-2 bg-surface text-primary rounded-lg font-bold text-sm focus-ring border border-default"
            >
              Schedule
            </button>
            <button
              aria-label="Mark contacted"
              onClick={() => onAction?.("contact", application.id)}
              className="px-4 py-2 bg-soft-warning text-warning rounded-lg font-bold text-sm focus-ring border border-warning/40"
            >
              Contacted
            </button>
            <button
              aria-label="Generate quote card"
              onClick={() => onAction?.("quote-card", application.id)}
              className="px-4 py-2 accent-gradient text-white rounded-lg font-bold text-sm focus-ring"
            >
              Quote Card
            </button>
            <button
              aria-label="Export PDF"
              onClick={() => onAction?.("export", application.id)}
              className="px-4 py-2 bg-soft-danger text-danger rounded-lg font-bold text-sm focus-ring border border-danger/40"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
