"use client";

import { Partnership } from "@/types/partnership";
import { AlertCircle, Building2, CheckCircle2, Lightbulb, Mail, Target, TrendingUp, Users, X } from "lucide-react";

interface ApplicationDetailPanelProps {
  application: Partnership;
  onClose: () => void;
  onAction?: (action: string, applicationId: string) => void;
}

export default function ApplicationDetailPanel({ application, onClose, onAction }: ApplicationDetailPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-soft-success text-success border-success/40';
      case 'Pending':
        return 'bg-soft-warning text-warning border-warning/40';
      case 'In Review':
        return 'bg-soft-accent text-accent border-accent/40';
      case 'Rejected':
        return 'bg-soft-danger text-danger border-danger/40';
      default:
        return 'bg-surface-alt text-secondary border-default';
    }
  };

  const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="bg-surface border border-default rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-default">
        <div className="p-3 accent-gradient rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-primary text-lg">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, fullWidth = false }: { label: string, value: any, fullWidth?: boolean }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{label}</dt>
        <dd className="text-sm text-primary font-medium">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-soft-accent text-accent border border-accent/40 rounded-lg text-xs font-bold">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{value}</span>
          )}
        </dd>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md">
      <div className="bg-surface rounded-3xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-default">
        {/* Premium Header */}
        <div className="sticky top-0 accent-gradient text-white px-8 py-8 border-b border-default/20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4 leading-tight">{application.organizationName}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                {application.is501c3 && (
                  <span className="px-4 py-2 rounded-full text-xs font-bold bg-soft-success text-success border border-success/40">
                    ✓ 501(c)(3) Status
                  </span>
                )}
                {application.firstTime && (
                  <span className="px-4 py-2 rounded-full text-xs font-bold bg-white/20 text-white border border-white/40">
                    🆕 First-time Applicant
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white transition-all p-3 hover:bg-white/20 rounded-xl"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white text-xs font-bold uppercase tracking-wider mb-2">Submitted</div>
              <div className="text-xl font-bold text-white">{new Date(application.timestamp).toLocaleDateString()}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white text-xs font-bold uppercase tracking-wider mb-2">Location</div>
              <div className="text-xl font-bold text-white">{application.county || 'Unknown'}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white text-xs font-bold uppercase tracking-wider mb-2">Chromebooks</div>
              <div className="text-3xl font-bold text-white">{application.chromebooksNeeded}</div>
            </div>
          </div>
        </div>

        {/* Content - Grid Layout */}
        <div className="p-8 space-y-6 max-h-[calc(100vh-340px)] overflow-y-auto scrollbar-hide">
          {/* Contact Information */}
          <InfoSection icon={Mail} title="📧 Contact Information">
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="Contact Person" value={application.contactPerson} />
              <InfoRow label="Email" value={application.email} />
              <InfoRow label="Phone" value={application.phone} />
              <InfoRow label="Preferred Contact" value={application.preferredContactMethod} />
              <InfoRow label="Address" value={application.address} fullWidth />
              <InfoRow label="Website" value={application.website} />
            </dl>
          </InfoSection>

          {/* Organization Details */}
          <InfoSection icon={Building2} title="🏢 Organization Details">
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="Organization Type" value={application.organizationType} />
              <InfoRow label="County" value={application.county} />
              <InfoRow label="501(c)(3) Status" value={application.is501c3 ? "Yes ✓" : "No"} />
              <InfoRow label="First-time Applicant" value={application.firstTime ? "Yes" : "Returning"} />
              <InfoRow label="How They Heard About HTI" value={application.howHeard} fullWidth />
            </dl>
          </InfoSection>

          {/* Client Population */}
          <InfoSection icon={Users} title="👥 Client Population & Needs">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Works With" value={application.workssWith} fullWidth />
              <InfoRow label="Client Struggles Being Addressed" value={application.clientStruggles} fullWidth />
              <InfoRow label="Client Goals" value={application.clientGoals} fullWidth />
            </dl>
          </InfoSection>

          {/* How They'll Use Chromebooks */}
          <InfoSection icon={Lightbulb} title="💡 How They'll Use Chromebooks">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Chromebooks Requested" value={application.chromebooksNeeded} />
              <InfoRow label="How They'll Use Them" value={application.howWillUse} fullWidth />
              <InfoRow label="How Clients Will Use Laptops" value={application.howClientsUseLaptops} fullWidth />
            </dl>
          </InfoSection>

          {/* Expected Impact */}
          <InfoSection icon={TrendingUp} title="📈 Expected Impact">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Positive Impact Expected" value={application.positiveImpact} fullWidth />
              <InfoRow label="What Clients Will Achieve" value={application.whatClientsAchieve} fullWidth />
              <InfoRow label="How to Continue Relationship" value={application.howToContinueRelationship} fullWidth />
            </dl>
          </InfoSection>

          {/* Marketing Assets */}
          {(application.quote || application.oneWord) && (
            <InfoSection icon={Target} title="🎯 Marketing Assets">
              <dl className="grid grid-cols-1 gap-4">
                {application.quote && (
                    <div className="p-6 rounded-xl border-l-4 border-accent bg-soft-accent">
                      <p className="text-primary italic text-lg leading-relaxed font-semibold">
                      "{application.quote}"
                    </p>
                  </div>
                )}
                <InfoRow label="In One Word" value={application.oneWord} />
              </dl>
            </InfoSection>
          )}

          {/* Internal Notes */}
          {(application.notes || application.internalComments) && (
            <div className="bg-surface border-l-4 border-danger rounded-2xl p-6 border border-danger/30">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-default">
                <div className="p-3 bg-soft-danger rounded-lg">
                  <AlertCircle className="w-5 h-5 text-danger" />
                </div>
                <h3 className="font-bold text-primary text-lg">Internal Notes</h3>
              </div>
              <dl className="grid grid-cols-1 gap-4">
                <InfoRow label="Notes" value={application.notes} fullWidth />
                <InfoRow label="Comments" value={application.internalComments} fullWidth />
              </dl>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-surface-alt backdrop-blur-xl px-8 py-6 border-t border-default">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Primary Action - Approve */}
            <button
              onClick={() => onAction?.('approve', application.id)}
              className="col-span-1 px-4 py-3 bg-soft-success text-success hover:bg-soft-success rounded-xl font-bold transition-all shadow hover:shadow-lg transform text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden md:inline text-sm">Approve</span>
            </button>

            {/* Request Info */}
            <button
              onClick={() => onAction?.('request-info', application.id)}
              className="col-span-1 px-4 py-3 bg-soft-accent text-accent rounded-xl font-bold transition-all shadow hover:shadow-lg transform text-sm"
            >
              More Info
            </button>

            {/* Schedule */}
            <button
              onClick={() => onAction?.('schedule', application.id)}
              className="col-span-1 px-4 py-3 bg-surface-alt hover:bg-surface text-primary rounded-xl font-bold transition-all border border-default shadow hover:shadow-lg transform text-sm"
            >
              Schedule
            </button>

            {/* Contact */}
            <button
              onClick={() => onAction?.('contact', application.id)}
              className="col-span-1 px-4 py-3 bg-soft-warning text-warning rounded-xl font-bold transition-all border border-warning/30 shadow hover:shadow-lg transform text-sm"
            >
              Contacted
            </button>

            {/* Quote Card */}
            <button
              onClick={() => onAction?.('quote-card', application.id)}
              className="col-span-1 px-4 py-3 accent-gradient text-white rounded-xl font-bold transition-all shadow hover:shadow-lg transform text-sm"
            >
              Quote Card
            </button>

            {/* Export */}
            <button
              onClick={() => onAction?.('export', application.id)}
              className="col-span-1 px-4 py-3 bg-soft-danger text-danger rounded-xl font-bold transition-all border border-danger/40 shadow hover:shadow-lg transform text-sm"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
