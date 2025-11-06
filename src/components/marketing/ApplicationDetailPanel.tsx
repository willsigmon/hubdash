"use client";

import { Partnership } from "@/types/partnership";
import { X, Mail, Phone, Building2, Users, Target, Lightbulb, TrendingUp, Calendar, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface ApplicationDetailPanelProps {
  application: Partnership;
  onClose: () => void;
  onAction?: (action: string, applicationId: string) => void;
}

export default function ApplicationDetailPanel({ application, onClose, onAction }: ApplicationDetailPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/30 text-green-700 border-green-500/60';
      case 'Pending':
        return 'bg-hti-yellow/30 text-hti-navy border-hti-yellow/60';
      case 'In Review':
        return 'bg-hti-orange/30 text-hti-red border-hti-orange/60';
      case 'Rejected':
        return 'bg-hti-red/30 text-hti-red border-hti-red/60';
      default:
        return 'bg-hti-gray/30 text-hti-navy border-hti-gray/60';
    }
  };

  const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="bg-white/80 backdrop-blur-xl border border-hti-orange/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-hti-orange/60">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-hti-orange/50">
        <div className="p-3 bg-gradient-to-br from-hti-orange to-hti-red rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-hti-navy text-lg">{title}</h3>
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
        <dt className="text-xs font-bold text-hti-orange uppercase tracking-wider mb-2">{label}</dt>
        <dd className="text-sm text-hti-navy font-medium">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-hti-orange/20 text-hti-navy border border-hti-orange/60 rounded-lg text-xs font-bold">
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
      <div className="bg-gradient-to-br from-white via-hti-yellow/3 to-hti-orange/5 rounded-3xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-hti-yellow/50">
        {/* Premium Header */}
        <div className="sticky top-0 bg-gradient-to-r from-hti-orange via-hti-red to-hti-orange text-white px-8 py-8 border-b-4 border-hti-yellow">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4 leading-tight">{application.organizationName}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                {application.is501c3 && (
                  <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-500/20 text-green-600 border border-green-500/40">
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
              className="text-white/80 hover:text-white transition-all p-3 hover:bg-white/20 rounded-xl"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Submitted</div>
              <div className="text-xl font-bold text-hti-yellow">{new Date(application.timestamp).toLocaleDateString()}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Location</div>
              <div className="text-xl font-bold text-hti-yellow">{application.county || 'Unknown'}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/50 transition-all">
              <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Chromebooks</div>
              <div className="text-3xl font-bold text-hti-yellow-bright">{application.chromebooksNeeded}</div>
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
                  <div className="bg-gradient-to-br from-hti-yellow/25 to-hti-orange/20 p-6 rounded-xl border-l-4 border-hti-orange">
                    <p className="text-hti-navy italic text-lg leading-relaxed font-semibold">
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
            <div className="bg-white/80 backdrop-blur-xl border-l-4 border-hti-red bg-gradient-to-br from-hti-red/10 to-hti-orange/10 rounded-2xl p-6 border border-hti-red/50">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-hti-red/50">
                <div className="p-3 bg-hti-red/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-hti-red" />
                </div>
                <h3 className="font-bold text-hti-navy text-lg">Internal Notes</h3>
              </div>
              <dl className="grid grid-cols-1 gap-4">
                <InfoRow label="Notes" value={application.notes} fullWidth />
                <InfoRow label="Comments" value={application.internalComments} fullWidth />
              </dl>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-hti-orange/10 via-hti-yellow/10 to-hti-orange/10 backdrop-blur-xl px-8 py-6 border-t border-hti-orange/50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Primary Action - Approve */}
            <button
              onClick={() => onAction?.('approve', application.id)}
              className="col-span-1 px-4 py-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-110 transform flex items-center justify-center gap-2 group"
            >
              <CheckCircle2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span className="hidden md:inline text-sm">Approve</span>
            </button>

            {/* Request Info */}
            <button
              onClick={() => onAction?.('request-info', application.id)}
              className="col-span-1 px-4 py-3 bg-gradient-to-br from-hti-orange to-hti-red hover:from-hti-red hover:to-hti-orange text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-110 transform text-sm"
            >
              More Info
            </button>

            {/* Schedule */}
            <button
              onClick={() => onAction?.('schedule', application.id)}
              className="col-span-1 px-4 py-3 bg-white hover:bg-hti-gray-light text-hti-navy rounded-xl font-bold transition-all border border-hti-orange/50 shadow-md hover:shadow-lg hover:scale-110 transform text-sm"
            >
              Schedule
            </button>

            {/* Contact */}
            <button
              onClick={() => onAction?.('contact', application.id)}
              className="col-span-1 px-4 py-3 bg-hti-yellow/20 hover:bg-hti-yellow/40 text-hti-navy rounded-xl font-bold transition-all border-2 border-hti-yellow/40 shadow-md hover:shadow-lg hover:scale-110 transform text-sm"
            >
              Contacted
            </button>

            {/* Quote Card */}
            <button
              onClick={() => onAction?.('quote-card', application.id)}
              className="col-span-1 px-4 py-3 bg-gradient-to-br from-hti-yellow to-hti-yellow-bright hover:from-hti-yellow-bright hover:to-hti-yellow text-hti-navy rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-110 transform text-sm"
            >
              Quote Card
            </button>

            {/* Export */}
            <button
              onClick={() => onAction?.('export', application.id)}
              className="col-span-1 px-4 py-3 bg-hti-red/20 hover:bg-hti-red/40 text-hti-red rounded-xl font-bold transition-all border border-hti-red/50 shadow-md hover:shadow-lg hover:scale-110 transform text-sm"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
