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
        return 'bg-green-500 text-white border-green-400';
      case 'Pending':
        return 'bg-yellow-500 text-white border-yellow-400';
      case 'In Review':
        return 'bg-blue-500 text-white border-blue-400';
      case 'Rejected':
        return 'bg-red-500 text-white border-red-400';
      default:
        return 'bg-gray-600 text-white border-gray-500';
    }
  };

  const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="border-l-4 border-hti-teal bg-gradient-to-br from-hti-teal/5 to-hti-navy/5 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-hti-teal/30">
        <div className="p-2 bg-hti-teal/20 rounded-lg">
          <Icon className="w-5 h-5 text-hti-teal" />
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
        <dt className="text-sm font-semibold text-hti-navy mb-2">{label}</dt>
        <dd className="text-sm text-gray-800">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-hti-teal/20 text-hti-navy border border-hti-teal/40 rounded-md text-xs font-medium">
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-5xl w-full my-8 shadow-2xl overflow-hidden">
        {/* Premium Header */}
        <div className="sticky top-0 bg-gradient-to-br from-hti-navy via-hti-teal to-hti-navy text-white px-8 py-8 rounded-t-3xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4 leading-tight">{application.organizationName}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                {application.is501c3 && (
                  <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-400 text-green-900 border border-green-300">
                    ✓ 501(c)(3) Status
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-white/80 text-xs font-medium mb-1">Submitted</div>
              <div className="text-white font-semibold">{new Date(application.timestamp).toLocaleDateString()}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-white/80 text-xs font-medium mb-1">Location</div>
              <div className="text-white font-semibold">{application.county || 'Unknown'} County</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-white/80 text-xs font-medium mb-1">Chromebooks</div>
              <div className="text-2xl font-bold text-hti-yellow">{application.chromebooksNeeded}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Contact Information */}
          <InfoSection icon={Mail} title="Contact Information">
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
          <InfoSection icon={Building2} title="Organization Details">
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="Organization Type" value={application.organizationType} />
              <InfoRow label="County" value={application.county} />
              <InfoRow label="501(c)(3) Status" value={application.is501c3 ? "Yes" : "No"} />
              <InfoRow label="First-time Applicant" value={application.firstTime ? "Yes" : "Returning"} />
              <InfoRow label="How They Heard About HTI" value={application.howHeard} fullWidth />
            </dl>
          </InfoSection>

          {/* Client Population */}
          <InfoSection icon={Users} title="Client Population & Needs">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Works With" value={application.workssWith} fullWidth />
              <InfoRow label="Client Struggles Being Addressed" value={application.clientStruggles} fullWidth />
              <InfoRow label="Client Goals" value={application.clientGoals} fullWidth />
            </dl>
          </InfoSection>

          {/* How They'll Use Chromebooks */}
          <InfoSection icon={Lightbulb} title="How They'll Use Chromebooks">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Chromebooks Requested" value={application.chromebooksNeeded} />
              <InfoRow label="How They'll Use Them" value={application.howWillUse} fullWidth />
              <InfoRow label="How Clients Will Use Laptops" value={application.howClientsUseLaptops} fullWidth />
            </dl>
          </InfoSection>

          {/* Expected Impact */}
          <InfoSection icon={TrendingUp} title="Expected Impact">
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Positive Impact Expected" value={application.positiveImpact} fullWidth />
              <InfoRow label="What Clients Will Achieve" value={application.whatClientsAchieve} fullWidth />
              <InfoRow label="How to Continue Relationship" value={application.howToContinueRelationship} fullWidth />
            </dl>
          </InfoSection>

          {/* Marketing Assets */}
          {(application.quote || application.oneWord) && (
            <InfoSection icon={Target} title="Marketing Assets">
              <dl className="grid grid-cols-1 gap-4">
                {application.quote && (
                  <div className="bg-gradient-to-br from-hti-teal/15 to-hti-navy/10 p-6 rounded-lg border-l-4 border-hti-teal border border-hti-teal/30">
                    <p className="text-hti-navy italic text-lg leading-relaxed font-medium">
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
            <div className="border-l-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-yellow-200">
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-700" />
                </div>
                <h3 className="font-bold text-yellow-900 text-lg">Internal Notes</h3>
              </div>
              <dl className="grid grid-cols-1 gap-4">
                <InfoRow label="Notes" value={application.notes} fullWidth />
                <InfoRow label="Comments" value={application.internalComments} fullWidth />
              </dl>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-white px-8 py-8 border-t-2 border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Primary Action - Approve */}
            <button
              onClick={() => onAction?.('approve', application.id)}
              className="col-span-1 px-6 py-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform flex items-center justify-center gap-2 group"
            >
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Approve</span>
            </button>

            {/* Request Info */}
            <button
              onClick={() => onAction?.('request-info', application.id)}
              className="col-span-1 px-6 py-4 bg-gradient-to-br from-hti-navy to-hti-teal hover:from-hti-teal hover:to-hti-navy text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform"
            >
              More Info
            </button>

            {/* Schedule */}
            <button
              onClick={() => onAction?.('schedule', application.id)}
              className="col-span-1 px-6 py-4 bg-white hover:bg-gray-50 text-hti-navy rounded-xl font-bold transition-all border-2 border-hti-teal shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              Schedule
            </button>

            {/* Contact */}
            <button
              onClick={() => onAction?.('contact', application.id)}
              className="col-span-1 px-6 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-all border-2 border-blue-300 shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              Contacted
            </button>

            {/* Quote Card */}
            <button
              onClick={() => onAction?.('quote-card', application.id)}
              className="col-span-1 px-6 py-4 bg-gradient-to-br from-hti-yellow to-yellow-400 hover:from-yellow-400 hover:to-hti-yellow text-gray-900 rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform"
            >
              Quote Card
            </button>

            {/* Export */}
            <button
              onClick={() => onAction?.('export', application.id)}
              className="col-span-1 px-6 py-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-all border-2 border-purple-300 shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
