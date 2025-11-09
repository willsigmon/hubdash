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
  // Validate application object
  if (!application || !application.id) {
    console.error('ApplicationDetailPanel: Invalid application object', application);
    return null;
  }

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useMemo(() => `app-detail-title-${application.id}`, [application.id]);

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
              <div className="rounded-xl border border-default bg-surface p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  <h3 className="text-base sm:text-lg font-bold text-primary">Contact</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Person</div>
                    <div className="text-base sm:text-lg text-primary font-semibold">{application.contactPerson || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Email</div>
                    <div className="text-base sm:text-lg text-primary font-semibold break-all">{application.email || 'No email provided'}</div>
                  </div>
                  {application.phone && (
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Phone</div>
                      <div className="text-base sm:text-lg text-primary font-semibold">{application.phone}</div>
                    </div>
                  )}
                  {application.preferredContactMethod && (
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Preferred</div>
                      <div className="text-base sm:text-lg text-primary font-semibold">{application.preferredContactMethod}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Organization */}
              <div className="rounded-xl border border-default bg-surface p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  <h3 className="text-base sm:text-lg font-bold text-primary">Organization</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  {application.organizationType && (
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Type</div>
                      <div className="text-base sm:text-lg text-primary font-semibold">{application.organizationType}</div>
                    </div>
                  )}
                  {application.county && (
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">County</div>
                      <div className="text-base sm:text-lg text-primary font-semibold">{application.county}</div>
                    </div>
                  )}
                  {application.website && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Website</div>
                      <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg text-accent hover:underline font-semibold break-all">
                        {application.website}
                      </a>
                    </div>
                  )}
                  {application.address && (
                    <div className="col-span-1 sm:col-span-2">
                      <div className="text-xs sm:text-sm font-semibold text-secondary mb-1">Address</div>
                      <div className="text-base sm:text-lg text-primary font-semibold">{application.address}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Info */}
              {(application.workssWith?.length > 0 || application.clientStruggles?.length > 0 || application.clientGoals) && (
                <div className="rounded-xl border border-default bg-surface p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-accent" />
                    <h3 className="text-sm font-semibold text-primary">Client Info</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    {application.workssWith?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-secondary mb-1.5">Communities Served</div>
                        <div className="flex flex-wrap gap-1.5">
                          {application.workssWith.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 rounded border border-accent bg-soft-accent text-accent text-xs font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {application.clientStruggles?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-secondary mb-1.5">Challenges</div>
                        <div className="flex flex-wrap gap-1.5">
                          {application.clientStruggles.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 rounded border border-warning bg-soft-warning text-warning text-xs font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {application.clientGoals && (
                      <div>
                        <div className="text-xs font-semibold text-secondary mb-0.5">Goals</div>
                        <div className="text-primary">{application.clientGoals}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Usage & Impact */}
              <div className="rounded-xl border border-default bg-surface p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-primary">Usage & Impact</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {application.howWillUse && (
                    <div>
                      <div className="text-xs font-semibold text-secondary mb-0.5">How They'll Use</div>
                      <div className="text-primary">{application.howWillUse}</div>
                    </div>
                  )}
                  {application.positiveImpact && (
                    <div>
                      <div className="text-xs font-semibold text-secondary mb-0.5">Expected Impact</div>
                      <div className="text-primary">{application.positiveImpact}</div>
                    </div>
                  )}
                  {application.howClientsUseLaptops && typeof application.howClientsUseLaptops === 'string' && (
                    <div>
                      <div className="text-xs font-semibold text-secondary mb-1.5">Client Usage</div>
                      <div className="flex flex-wrap gap-1.5">
                        {application.howClientsUseLaptops.split(',').map((item, idx) => (
                          <span key={idx} className="px-2 py-1 rounded border border-accent bg-soft-accent text-accent text-xs font-medium">
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quote if available */}
              {application.quote && (
                <div className="rounded-xl border border-accent bg-soft-accent p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="h-4 w-4 text-accent" />
                    <h3 className="text-sm font-semibold text-accent">Quote</h3>
                  </div>
                  <p className="text-sm text-primary italic">"{application.quote}"</p>
                  {application.oneWord && (
                    <div className="mt-2 text-xs text-secondary">
                      <span className="font-semibold">One word:</span> {application.oneWord}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {(application.notes || application.internalComments) && (
                <div className="rounded-xl border border-danger bg-soft-danger p-4">
                  <h3 className="text-sm font-semibold text-danger mb-2">Internal Notes</h3>
                  <div className="space-y-2 text-sm">
                    {application.notes && (
                      <div>
                        <div className="text-xs font-semibold text-danger mb-0.5">Notes</div>
                        <div className="text-primary">{application.notes}</div>
                      </div>
                    )}
                    {application.internalComments && (
                      <div>
                        <div className="text-xs font-semibold text-danger mb-0.5">Comments</div>
                        <div className="text-primary">{application.internalComments}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-default bg-surface p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => onAction?.("approve", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-success bg-soft-success px-3 py-2 text-sm font-semibold text-success transition hover:shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => onAction?.("request-info", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-accent bg-soft-accent px-3 py-2 text-sm font-semibold text-accent transition hover:shadow-md"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => onAction?.("schedule", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-default bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:border-strong hover:shadow-md"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => onAction?.("contact", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-highlight bg-soft-highlight px-3 py-2 text-sm font-semibold text-highlight transition hover:shadow-md"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => onAction?.("quote-card", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg highlight-gradient px-3 py-2 text-sm font-semibold text-primary shadow transition hover:shadow-md"
                  >
                    Generate Quote Card
                  </button>
                  <button
                    onClick={() => onAction?.("export", application.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-default bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:border-strong hover:shadow-md"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-xl border border-default bg-surface-alt p-4">
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
                  {application.howHeard && (
                    <div className="pt-2 border-t border-default">
                      <div className="text-xs text-secondary mb-0.5">How they heard</div>
                      <div className="text-sm text-primary">{application.howHeard}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
