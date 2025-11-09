"use client";

import { Partnership } from "@/types/partnership";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Quote,
  Users,
  X,
  MessageSquare,
  Calendar,
  FileDown,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuoteCardGenerator from "./QuoteCardGenerator";

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
  // Validate application object
  if (!application || !application.id) {
    console.error('ApplicationDetailPanel: Invalid application object', application);
    return null;
  }

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useMemo(() => `app-detail-title-${application.id}`, [application.id]);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: string; message: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-soft-success text-success border-success";
      case "Pending":
        return "bg-soft-highlight text-highlight border-highlight";
      case "In Review":
        return "bg-soft-accent text-accent border-accent";
      case "Rejected":
        return "bg-soft-danger text-danger border-danger";
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

  const handleAction = (action: string) => {
    switch (action) {
      case "approve":
        setActionFeedback({ type: "success", message: "Application approved!" });
        onAction?.(action, application.id);
        setTimeout(() => setActionFeedback(null), 3000);
        break;
      case "request-info":
        if (application.email) {
          window.location.href = `mailto:${application.email}?subject=Additional Information Request - ${application.organizationName}`;
        } else {
          setActionFeedback({ type: "warning", message: "No email address available" });
          setTimeout(() => setActionFeedback(null), 3000);
        }
        onAction?.(action, application.id);
        break;
      case "schedule":
        // This could open a calendar picker
        setActionFeedback({ type: "info", message: "Scheduling feature coming soon" });
        setTimeout(() => setActionFeedback(null), 3000);
        onAction?.(action, application.id);
        break;
      case "contact":
        setActionFeedback({ type: "success", message: "Marked as contacted!" });
        onAction?.(action, application.id);
        setTimeout(() => setActionFeedback(null), 3000);
        break;
      case "quote-card":
        if (application.quote) {
          setShowQuoteGenerator(true);
        } else {
          setActionFeedback({ type: "warning", message: "No quote available for this application" });
          setTimeout(() => setActionFeedback(null), 3000);
        }
        break;
      case "export":
        // Generate PDF export
        setActionFeedback({ type: "info", message: "Generating PDF..." });
        window.print();
        setTimeout(() => setActionFeedback(null), 3000);
        onAction?.(action, application.id);
        break;
      default:
        onAction?.(action, application.id);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setActionFeedback({ type: "success", message: `${label} copied to clipboard!` });
    setTimeout(() => setActionFeedback(null), 2000);
  };

  return (
    <>
      {showQuoteGenerator && application.quote && (
        <QuoteCardGenerator
          quote={application.quote}
          authorName={application.contactPerson || application.organizationName || "HTI Partner"}
          authorTitle={application.organizationType || undefined}
          county={application.county || undefined}
          onClose={() => setShowQuoteGenerator(false)}
        />
      )}
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
        className="my-4 w-full max-w-6xl overflow-hidden rounded-2xl border border-default bg-surface shadow-2xl"
      >
        {/* Compact Header */}
        <div className="border-b border-default bg-surface-alt px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 id={titleId} className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary truncate">
                  {application.organizationName || 'Unknown Organization'}
                </h2>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(application.status || 'Pending')}`}>
                  {application.status || 'Pending'}
                </span>
                {application.is501c3 && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold border border-success bg-soft-success text-success">
                    501(c)(3)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-secondary">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {application.county || "Unknown County"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {typeof application.chromebooksNeeded === 'number' ? application.chromebooksNeeded : 0} requested
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {application.timestamp ? (() => {
                    try {
                      const date = new Date(application.timestamp);
                      if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString();
                      }
                    } catch (e) {
                      // Fall through
                    }
                    return 'Unknown Date';
                  })() : 'Unknown Date'}
                </span>
                {typeof application.firstTime === 'boolean' && application.firstTime && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold border border-highlight bg-soft-highlight text-highlight">
                    First-time
                  </span>
                )}
              </div>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg border border-default p-2 text-secondary hover:bg-surface hover:text-primary transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content - Compact Grid */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contact */}
              <div className="rounded-xl border-2 border-default bg-surface p-4 hover:border-accent/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    <h3 className="text-base sm:text-lg font-bold text-primary">Contact</h3>
                  </div>
                  {application.email && (
                    <a
                      href={`mailto:${application.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 text-accent" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div className="group/item">
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Person</div>
                    <div className="text-base sm:text-lg text-primary font-semibold flex items-center gap-2">
                      {application.contactPerson || <span className="text-muted italic">Not provided</span>}
                      {application.contactPerson && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(application.contactPerson!, "Name");
                          }}
                          className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                          <Copy className="h-3 w-3 text-muted hover:text-accent" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="group/item">
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Email</div>
                    {application.email ? (
                      <a
                        href={`mailto:${application.email}`}
                        className="text-base sm:text-lg text-accent hover:underline font-semibold break-all flex items-center gap-2"
                      >
                        {application.email}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <div className="text-base sm:text-lg text-primary font-semibold"><span className="text-muted italic">Not provided</span></div>
                    )}
                  </div>
                  <div className="group/item">
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Phone</div>
                    {application.phone ? (
                      <a
                        href={`tel:${application.phone}`}
                        className="text-base sm:text-lg text-accent hover:underline font-semibold flex items-center gap-2"
                      >
                        {application.phone}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <div className="text-base sm:text-lg text-primary font-semibold"><span className="text-muted italic">Not provided</span></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Preferred</div>
                    <div className="text-base sm:text-lg text-primary font-semibold">{application.preferredContactMethod || <span className="text-muted italic">Not specified</span>}</div>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="rounded-xl border-2 border-default bg-surface p-4 hover:border-accent/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    <h3 className="text-base sm:text-lg font-bold text-primary">Organization</h3>
                  </div>
                  {application.website && (
                    <a
                      href={application.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 text-accent" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Type</div>
                    <div className="text-base sm:text-lg text-primary font-semibold">{application.organizationType || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">County</div>
                    <div className="text-base sm:text-lg text-primary font-semibold">{application.county || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Website</div>
                    {application.website ? (
                      <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg text-accent hover:underline font-semibold break-all">
                        {application.website}
                      </a>
                    ) : (
                      <div className="text-base sm:text-lg text-primary font-semibold"><span className="text-muted italic">Not provided</span></div>
                    )}
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Address</div>
                    <div className="text-base sm:text-lg text-primary font-semibold">{application.address || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="rounded-xl border-2 border-default bg-surface p-4 hover:border-accent/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-primary">Client Info</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-1.5">Communities Served</div>
                    {application.workssWith?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {application.workssWith.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 rounded border border-accent bg-soft-accent text-accent text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted italic text-xs">Not provided</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-1.5">Challenges</div>
                    {application.clientStruggles?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {application.clientStruggles.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 rounded border border-warning bg-soft-warning text-warning text-xs font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted italic text-xs">Not provided</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-0.5">Goals</div>
                    <div className="text-primary">{application.clientGoals || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                </div>
              </div>

              {/* Usage & Impact */}
              <div className="rounded-xl border-2 border-default bg-surface p-4 hover:border-accent/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-primary">Usage & Impact</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-0.5">How They'll Use</div>
                    <div className="text-primary">{application.howWillUse || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-0.5">Expected Impact</div>
                    <div className="text-primary">{application.positiveImpact || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-secondary mb-1.5">Client Usage</div>
                    {application.howClientsUseLaptops && typeof application.howClientsUseLaptops === 'string' ? (
                      <div className="flex flex-wrap gap-1.5">
                        {application.howClientsUseLaptops.split(',').map((item, idx) => (
                          <span key={idx} className="px-2 py-1 rounded border border-accent bg-soft-accent text-accent text-xs font-medium">
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted italic text-xs">Not provided</div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-default bg-surface p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAction("approve")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-success bg-soft-success px-3 py-2.5 text-sm font-bold text-success transition-all hover:bg-success hover:text-white hover:shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction("request-info")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-accent bg-soft-accent px-3 py-2.5 text-sm font-bold text-accent transition-all hover:bg-accent hover:text-white hover:shadow-lg"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Request Info
                  </button>
                  <button
                    onClick={() => handleAction("schedule")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-default bg-surface px-3 py-2.5 text-sm font-bold text-primary transition-all hover:border-accent hover:bg-surface-alt hover:shadow-md"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </button>
                  <button
                    onClick={() => handleAction("contact")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-highlight bg-soft-highlight px-3 py-2.5 text-sm font-bold text-highlight transition-all hover:bg-highlight hover:text-white hover:shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleAction("quote-card")}
                    disabled={!application.quote}
                    className="w-full flex items-center justify-center gap-2 rounded-lg highlight-gradient px-3 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Quote className="h-4 w-4" />
                    Generate Quote Card
                  </button>
                  <button
                    onClick={() => handleAction("export")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-default bg-surface px-3 py-2.5 text-sm font-bold text-primary transition-all hover:border-accent hover:bg-surface-alt hover:shadow-md"
                  >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                  </button>
                </div>
                {actionFeedback && (
                  <div className={`mt-3 p-2 rounded-lg text-xs font-semibold text-center ${
                    actionFeedback.type === "success" ? "bg-soft-success text-success" :
                    actionFeedback.type === "warning" ? "bg-soft-warning text-warning" :
                    "bg-soft-accent text-accent"
                  }`}>
                    {actionFeedback.message}
                  </div>
                )}
              </div>

              {/* Quote - Moved above Quick Stats */}
              {application.quote && (
                <div className="rounded-xl border-2 border-accent bg-soft-accent p-4 hover:border-accent transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Quote className="h-4 w-4 text-accent" />
                      <h3 className="text-sm font-bold text-accent">Quote</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(application.quote!, "Quote")}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3 w-3 text-accent" />
                    </button>
                  </div>
                  <p className="text-sm text-primary italic leading-relaxed">"{application.quote}"</p>
                  {application.oneWord && (
                    <div className="mt-2 text-xs text-secondary">
                      <span className="font-semibold">One word:</span> {application.oneWord}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="rounded-xl border-2 border-default bg-surface-alt p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Devices</span>
                    <span className="font-semibold text-primary">{application.chromebooksNeeded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Status</span>
                    <span className={`font-semibold ${getStatusColor(application.status).split(' ')[1]}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-default">
                    <div className="text-xs text-secondary mb-0.5">How they heard</div>
                    <div className="text-sm text-primary">{application.howHeard || <span className="text-muted italic">Not provided</span>}</div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="rounded-xl border border-danger bg-soft-danger p-4">
                <h3 className="text-sm font-semibold text-danger mb-3">Internal Notes</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-danger mb-1.5">Notes</div>
                    <div className="text-primary leading-relaxed">{application.notes || <span className="text-muted italic">No notes</span>}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-danger mb-1.5">Comments</div>
                    <div className="text-primary leading-relaxed">{application.internalComments || <span className="text-muted italic">No comments</span>}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
