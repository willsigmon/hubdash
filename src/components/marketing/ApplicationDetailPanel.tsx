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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-hti-navy to-hti-teal text-white px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{application.organizationName}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                {application.is501c3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-400 text-green-900 border border-green-300">
                    501(c)(3)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {new Date(application.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{application.county} County</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{application.chromebooksNeeded} Chromebooks Needed</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
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
        <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onAction?.('approve', application.id)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve Application
            </button>
            <button
              onClick={() => onAction?.('request-info', application.id)}
              className="px-6 py-3 bg-gradient-to-r from-hti-navy to-hti-teal hover:opacity-90 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Request More Info
            </button>
            <button
              onClick={() => onAction?.('schedule', application.id)}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold transition-colors border border-gray-300"
            >
              Schedule Delivery
            </button>
            <button
              onClick={() => onAction?.('contact', application.id)}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold transition-colors border border-gray-300"
            >
              Mark as Contacted
            </button>
            <button
              onClick={() => onAction?.('quote-card', application.id)}
              className="px-6 py-3 bg-gradient-to-r from-hti-yellow to-yellow-400 hover:opacity-90 text-gray-900 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Generate Quote Card
            </button>
            <button
              onClick={() => onAction?.('export', application.id)}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold transition-colors border border-gray-300"
            >
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
