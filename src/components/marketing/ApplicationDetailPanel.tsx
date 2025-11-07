"use client";

import React from "react";
import { Partnership } from "@/types/partnership";
import { X, Mail, Phone, Building2, Users, Target, Lightbulb, TrendingUp, Calendar, MapPin, CheckCircle2, AlertCircle, Clock, XCircle, ExternalLink, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatDaysAgo, formatPlural } from "@/lib/utils/date-formatters";

interface ApplicationDetailPanelProps {
  application: Partnership;
  onClose: () => void;
  onAction?: (action: string, applicationId: string) => void;
  actionLoading?: string | null;
}

export default function ApplicationDetailPanel({ application, onClose, onAction, actionLoading }: ApplicationDetailPanelProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-green-500/15',
          text: 'text-green-700',
          border: 'border-green-500/40',
          icon: <CheckCircle2 className="w-4 h-4" />,
          accent: 'from-green-500/20 to-green-600/10'
        };
      case 'Pending':
        return {
          bg: 'bg-hti-yellow/20',
          text: 'text-hti-navy',
          border: 'border-hti-yellow/50',
          icon: <Clock className="w-4 h-4" />,
          accent: 'from-hti-yellow/25 to-hti-orange/15'
        };
      case 'In Review':
        return {
          bg: 'bg-hti-teal/15',
          text: 'text-hti-teal-dark',
          border: 'border-hti-teal/40',
          icon: <AlertCircle className="w-4 h-4" />,
          accent: 'from-hti-teal/25 to-hti-navy/15'
        };
      case 'Rejected':
        return {
          bg: 'bg-red-500/15',
          text: 'text-red-700',
          border: 'border-red-500/40',
          icon: <XCircle className="w-4 h-4" />,
          accent: 'from-red-500/20 to-red-600/10'
        };
      default:
        return {
          bg: 'bg-hti-sand/60',
          text: 'text-hti-stone',
          border: 'border-hti-stone/30',
          icon: <AlertCircle className="w-4 h-4" />,
          accent: 'from-hti-sand/40 to-white'
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const daysSinceSubmission = Math.floor((Date.now() - new Date(application.timestamp).getTime()) / (1000 * 60 * 60 * 24));

  const CollapsibleSection = ({ id, icon: Icon, title, children, defaultOpen = true }: { id: string, icon: any, title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const isCollapsed = collapsedSections.has(id);
    const shouldShow = defaultOpen ? !isCollapsed : isCollapsed;

    return (
      <div className="glass-card glass-card--subtle shadow-glass border border-white/25 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b glass-divider"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-hti-teal/20 to-hti-navy/10 rounded-lg">
              <Icon className="w-4 h-4 text-hti-teal" />
            </div>
            <h3 className="font-bold text-glass-bright text-base">{title}</h3>
          </div>
          {shouldShow ? (
            <ChevronUp className="w-4 h-4 text-glass-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-glass-muted" />
          )}
        </button>
        {shouldShow && (
          <div className="p-5 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const InfoRow = ({ label, value, icon, link, copyValue, fullWidth = false }: {
    label: string,
    value: any,
    icon?: React.ReactNode,
    link?: string,
    copyValue?: string,
    fullWidth?: boolean
  }) => {
    // Handle null/undefined/empty values more gracefully
    if (value === null || value === undefined || value === '') return null;
    if (Array.isArray(value) && value.length === 0) return null;
    if (typeof value === 'string' && value.trim() === '') return null;

    const displayValue = Array.isArray(value) ? value : value;
    const fieldId = `${label}-${typeof displayValue === 'string' ? displayValue : JSON.stringify(displayValue)}`;

    return (
      <div className={fullWidth ? "col-span-2" : ""}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <dt className="text-xs font-bold text-glass-muted tracking-wide mb-1.5 uppercase">{label}</dt>
            <dd className="text-sm text-glass-bright font-semibold leading-relaxed">
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2">
                  {value.map((item, idx) => (
                    <span key={idx} className="glass-chip glass-chip--slate text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              ) : React.isValidElement(value) ? (
                value
              ) : link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-hti-teal transition-colors inline-flex items-center gap-1.5 break-words text-hti-teal-dark font-bold">
                  {icon && <span className="text-glass-muted flex-shrink-0">{icon}</span>}
                  <span className="break-all">{String(displayValue)}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              ) : (
                <span className="whitespace-pre-wrap flex items-start gap-2 break-words text-hti-navy font-semibold">
                  {icon && <span className="text-glass-muted mt-0.5 flex-shrink-0">{icon}</span>}
                  <span>{String(displayValue)}</span>
                </span>
              )}
            </dd>
          </div>
          {copyValue && (
            <button
              onClick={() => copyToClipboard(copyValue, fieldId)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {copiedField === fieldId ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-glass-muted" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md">
      <div className="glass-card glass-card--subtle shadow-2xl rounded-3xl max-w-7xl w-full my-8 overflow-hidden border border-white/30 max-h-[90vh] flex flex-col">
        <div className={`glass-card__glow bg-gradient-to-br ${statusConfig.accent}`} />

        {/* Compact Header */}
        <div className="relative px-6 md:px-8 py-5 border-b glass-divider bg-gradient-to-r from-white/10 to-transparent">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-glass-bright truncate leading-tight">{application.organizationName}</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                  {statusConfig.icon}
                  {application.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {application.is501c3 && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-700 border border-green-500/30 group/501c3 relative cursor-help"
                    title="501(c)(3) tax-exempt status verified - This organization has been verified as a tax-exempt nonprofit"
                  >
                    ✓ 501(c)(3)
                  </span>
                )}
                {application.firstTime && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-hti-teal/15 text-hti-teal-dark border border-hti-teal/30">
                    🆕 First-time
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold glass-chip glass-chip--slate">
                  {formatPlural(application.chromebooksNeeded, 'Chromebook')}
                </span>
                {application.county && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold glass-chip glass-chip--slate">
                    {application.county}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {application.email && (
                <a
                  href={`mailto:${application.email}`}
                  className="glass-button glass-button--accent p-2.5"
                  title="Send email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {application.phone && (
                <a
                  href={`tel:${application.phone}`}
                  className="glass-button p-2.5"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={onClose}
                className="text-glass-muted hover:text-glass-bright transition-all p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Compact Stats Row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-glass-muted">
              <Calendar className="w-4 h-4" />
              <span className="font-bold text-glass-bright text-base">{new Date(application.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              {daysSinceSubmission > 0 && (
                <span className="text-xs text-glass-muted">({formatDaysAgo(daysSinceSubmission)})</span>
              )}
            </div>
            {application.contactPerson && (
              <div className="flex items-center gap-2 text-glass-muted">
                <Users className="w-4 h-4" />
                <span className="font-bold text-glass-bright text-base">{application.contactPerson}</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Content Layout */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Contact & Quick Info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Contact Card */}
              <div className="glass-card glass-card--subtle shadow-glass p-5 border border-white/25">
                <h3 className="font-bold text-glass-bright text-lg mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-hti-teal" />
                  Quick Contact
                </h3>
                <div className="space-y-3">
                  {application.email && (
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`mailto:${application.email}`}
                        className="text-sm text-hti-teal-dark font-bold hover:text-hti-teal transition-colors break-all flex-1 min-w-0"
                      >
                        {application.email}
                      </a>
                      <button
                        onClick={() => copyToClipboard(application.email, 'email')}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-glass-muted" />
                        )}
                      </button>
                    </div>
                  )}
                  {application.phone && (
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`tel:${application.phone}`}
                        className="text-sm text-hti-teal-dark font-bold hover:text-hti-teal transition-colors"
                      >
                        {application.phone}
                      </a>
                      <button
                        onClick={() => application.phone && copyToClipboard(application.phone, 'phone')}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                        title="Copy phone"
                      >
                        {copiedField === 'phone' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-glass-muted" />
                        )}
                      </button>
                    </div>
                  )}
                  {application.address && (
                    <div className="pt-3 border-t glass-divider">
                      <p className="text-xs text-glass-muted font-semibold mb-1.5 uppercase tracking-wide">Address</p>
                      <p className="text-sm text-hti-navy font-bold leading-relaxed">{application.address}</p>
                    </div>
                  )}
                  {application.website && (
                    <div>
                      <a
                        href={application.website.startsWith('http') ? application.website : `https://${application.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-hti-teal-dark font-bold hover:text-hti-teal hover:underline inline-flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Organization Quick Info */}
              <div className="glass-card glass-card--subtle shadow-glass p-5 border border-white/25">
                <h3 className="font-bold text-glass-bright text-lg mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-hti-teal" />
                  Organization
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-glass-muted font-bold mb-1.5 uppercase tracking-wide">Type</dt>
                    <dd className="text-sm text-hti-navy font-bold capitalize">{application.organizationType || <span className="text-glass-muted italic font-normal">Not specified</span>}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-glass-muted font-bold mb-1.5 uppercase tracking-wide">County</dt>
                    <dd className="text-sm text-hti-navy font-bold">{application.county || <span className="text-glass-muted italic font-normal">Not specified</span>}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-glass-muted font-bold mb-1.5 uppercase tracking-wide">501(c)(3)</dt>
                    <dd className="text-sm text-hti-navy font-bold">{application.is501c3 ? <span className="flex items-center gap-1">Yes ✓ <span className="text-xs text-glass-muted font-normal">(Tax-exempt)</span></span> : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-glass-muted font-bold mb-1.5 uppercase tracking-wide">Applicant Type</dt>
                    <dd className="text-sm text-hti-navy font-bold">{application.firstTime ? 'First-time' : 'Returning'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column - Detailed Sections */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contact Information */}
              <CollapsibleSection id="contact" icon={Mail} title="Contact Information" defaultOpen={true}>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Contact Person" value={application.contactPerson} icon={<Users className="w-4 h-4" />} />
                  <InfoRow label="Email" value={application.email} icon={<Mail className="w-4 h-4" />} link={application.email ? `mailto:${application.email}` : undefined} copyValue={application.email} />
                  <InfoRow label="Phone" value={application.phone} icon={<Phone className="w-4 h-4" />} link={application.phone ? `tel:${application.phone}` : undefined} copyValue={application.phone} />
                  <InfoRow label="Preferred Contact" value={application.preferredContactMethod} />
                  <InfoRow label="Address" value={application.address} fullWidth icon={<MapPin className="w-4 h-4" />} />
                  <InfoRow label="Website" value={application.website} link={application.website ? (application.website.startsWith('http') ? application.website : `https://${application.website}`) : undefined} />
                </dl>
              </CollapsibleSection>

              {/* Organization Details */}
              <CollapsibleSection id="organization" icon={Building2} title="Organization Details" defaultOpen={false}>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Organization Type" value={application.organizationType || 'Not specified'} />
                  <InfoRow label="County" value={application.county || 'Not specified'} />
                  <InfoRow
                    label="501(c)(3) Status"
                    value={application.is501c3 ? (
                      <span className="flex items-center gap-2">
                        <span>Yes ✓</span>
                        <span className="text-xs text-glass-muted font-normal">(Tax-exempt nonprofit verified)</span>
                      </span>
                    ) : "No"}
                  />
                  <InfoRow label="First-time Applicant" value={application.firstTime ? "Yes" : "Returning"} />
                  <InfoRow label="How They Heard About HTI" value={application.howHeard || 'Not specified'} fullWidth />
                </dl>
              </CollapsibleSection>

              {/* Client Population */}
              <CollapsibleSection id="population" icon={Users} title="Client Population & Needs" defaultOpen={false}>
                <dl className="grid grid-cols-1 gap-4">
                  <InfoRow label="Works With" value={application.workssWith} fullWidth />
                  <InfoRow label="Client Struggles Being Addressed" value={application.clientStruggles} fullWidth />
                  <InfoRow label="Client Goals" value={application.clientGoals} fullWidth />
                </dl>
              </CollapsibleSection>

              {/* How They'll Use Chromebooks */}
              <CollapsibleSection id="usage" icon={Lightbulb} title="How They'll Use Chromebooks" defaultOpen={false}>
                <dl className="grid grid-cols-1 gap-4">
                  <InfoRow label="Chromebooks Requested" value={formatPlural(application.chromebooksNeeded, 'Chromebook')} />
                  <InfoRow label="How They'll Use Them" value={application.howWillUse} fullWidth />
                  <InfoRow label="How Clients Will Use Laptops" value={application.howClientsUseLaptops} fullWidth />
                </dl>
              </CollapsibleSection>

              {/* Expected Impact */}
              <CollapsibleSection id="impact" icon={TrendingUp} title="Expected Impact" defaultOpen={false}>
                <dl className="grid grid-cols-1 gap-4">
                  <InfoRow label="Positive Impact Expected" value={application.positiveImpact} fullWidth />
                  <InfoRow label="What Clients Will Achieve" value={application.whatClientsAchieve} fullWidth />
                  <InfoRow label="How to Continue Relationship" value={application.howToContinueRelationship} fullWidth />
                </dl>
              </CollapsibleSection>

              {/* Marketing Assets */}
              {(application.quote || application.oneWord) && (
                <CollapsibleSection id="marketing" icon={Target} title="Marketing Assets" defaultOpen={false}>
                  {application.quote && (
                    <div className="glass-card glass-card--subtle p-5 border-l-4 border-hti-teal/50 bg-gradient-to-r from-hti-teal/10 to-transparent mb-4">
                      <p className="text-hti-navy italic text-base leading-relaxed font-bold">
                        "{application.quote}"
                      </p>
                    </div>
                  )}
                  <InfoRow label="In One Word" value={application.oneWord} />
                </CollapsibleSection>
              )}

              {/* Internal Notes */}
              {(application.notes || application.internalComments) && (
                <div className="glass-card glass-card--subtle p-5 border-l-4 border-hti-red/50 bg-gradient-to-r from-hti-red/10 to-transparent border border-hti-red/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-hti-red/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-hti-red" />
                    </div>
                    <h3 className="font-bold text-glass-bright text-base">Internal Notes</h3>
                  </div>
                  <dl className="grid grid-cols-1 gap-4">
                    <InfoRow label="Notes" value={application.notes} fullWidth />
                    <InfoRow label="Comments" value={application.internalComments} fullWidth />
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Action Footer */}
        <div className="sticky bottom-0 px-6 md:px-8 py-4 border-t glass-divider bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onAction?.('approve', application.id)}
              disabled={actionLoading !== null}
              className="glass-button glass-button--accent text-sm font-bold flex items-center gap-2 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLoading === 'approve' ? 'Updating...' : 'Approve'}</span>
            </button>
            <button
              onClick={() => onAction?.('request-info', application.id)}
              disabled={actionLoading !== null}
              className="glass-button text-sm font-bold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'request-info' ? 'Updating...' : 'More Info'}
            </button>
            <button
              onClick={() => onAction?.('schedule', application.id)}
              disabled={actionLoading !== null}
              className="glass-button text-sm font-bold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'schedule' ? 'Scheduling...' : 'Schedule'}
            </button>
            <button
              onClick={() => onAction?.('contact', application.id)}
              disabled={actionLoading !== null}
              className="glass-button text-sm font-bold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'contact' ? 'Updating...' : 'Contacted'}
            </button>
            <button
              onClick={() => onAction?.('quote-card', application.id)}
              disabled={actionLoading !== null || !application.quote}
              className="glass-button text-sm font-bold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'quote-card' ? 'Generating...' : 'Quote Card'}
            </button>
            <button
              onClick={() => onAction?.('export', application.id)}
              disabled={actionLoading !== null}
              className="glass-button text-sm font-bold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'export' ? 'Exporting...' : 'Export PDF'}
            </button>
            {application.status !== 'Rejected' && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to reject ${application.organizationName}?`)) {
                    onAction?.('reject', application.id);
                  }
                }}
                disabled={actionLoading !== null}
                className="glass-button text-sm font-bold bg-red-500/15 text-red-700 border-red-500/40 hover:bg-red-500/25 px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
