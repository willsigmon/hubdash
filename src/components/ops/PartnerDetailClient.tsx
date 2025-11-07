"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar, Users, Building2, Package, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PartnerData {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  type: string;
  county: string;
  devices_received: number;
  status: string;
  notes?: string;
  address?: string;
  website?: string;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function PartnerDetailClient({ partnerId }: { partnerId: string }) {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "devices" | "activity">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/partners/${partnerId}`)
      .then(async (res) => {
        if (res.status === 404) {
          throw new Error("not_found");
        }
        if (!res.ok) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((data: PartnerData) => {
        setPartner(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching partner:', err);
        if (err.message === "not_found") {
          setError("Partner not found");
        } else {
          setError("Unable to load partner details right now.");
        }
        setPartner(null);
        setLoading(false);
      });
  }, [partnerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card glass-card--subtle shadow-glass p-6 h-96 animate-pulse" />
          </div>
          <div className="lg:col-span-2">
            <div className="glass-card glass-card--subtle shadow-glass p-6 h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass p-12 text-center border border-hti-red/40">
        <AlertCircle className="w-12 h-12 text-hti-red mx-auto mb-4" />
        <p className="text-glass-bright text-lg font-semibold mb-2">{error}</p>
        <Link href="/ops" className="glass-button glass-button--accent text-sm mt-4 inline-block">
          ← Back to Operations
        </Link>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="glass-card glass-card--subtle shadow-glass p-12 text-center">
        <p className="text-glass-bright text-lg font-semibold">Partner not found</p>
        <Link href="/ops" className="glass-button glass-button--accent text-sm mt-4 inline-block">
          ← Back to Operations
        </Link>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      label: "Devices Received",
      value: partner.devices_received,
      icon: <Package className="w-5 h-5" />,
      color: "text-hti-teal",
      gradient: "from-hti-teal/20 to-hti-teal-light/10"
    },
    {
      label: "People Impacted",
      value: Math.round(partner.devices_received * 1.5),
      icon: <Users className="w-5 h-5" />,
      color: "text-hti-orange",
      gradient: "from-hti-orange/20 to-hti-red/10"
    },
    {
      label: "Partnership Status",
      value: partner.status === "active" ? "Active" : "Pending",
      icon: partner.status === "active" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
      color: partner.status === "active" ? "text-green-600" : "text-hti-yellow",
      gradient: partner.status === "active" ? "from-green-500/20 to-green-600/10" : "from-hti-yellow/20 to-hti-orange/10"
    },
  ];

  const InfoSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="glass-card glass-card--subtle shadow-glass p-6 border border-white/25">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b glass-divider">
        <div className="p-2 bg-gradient-to-br from-hti-teal/20 to-hti-navy/10 rounded-lg">
          {icon}
        </div>
        <h3 className="font-bold text-glass-bright text-lg">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, icon, link }: { label: string, value: string | number | null | undefined, icon?: React.ReactNode, link?: string }) => {
    if (!value && value !== 0) return null;

    const content = (
      <div className="flex items-start gap-3">
        {icon && <div className="text-glass-muted mt-0.5 flex-shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <dt className="text-xs font-bold text-glass-muted tracking-wide mb-1 uppercase">{label}</dt>
          <dd className="text-sm text-glass-bright font-semibold break-words">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-hti-teal transition-colors inline-flex items-center gap-1">
                {String(value)}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              String(value)
            )}
          </dd>
        </div>
      </div>
    );

    return <div className="pb-3 border-b glass-divider last:border-b-0 last:pb-0">{content}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="glass-card glass-card--subtle shadow-glass overflow-hidden">
        <div className="glass-card__glow bg-gradient-to-br from-hti-navy/30 via-hti-teal/20 to-hti-navy/20" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-hti-teal to-hti-navy flex items-center justify-center text-3xl shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-glass-bright mb-1">{partner.name}</h1>
                  <p className="text-glass-muted font-medium capitalize">{partner.type}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`glass-chip ${partner.status === "active" ? "glass-chip--teal" : "glass-chip--yellow"} text-xs font-semibold`}>
                  {partner.status === "active" ? "✓ Active Partner" : "Pending"}
                </span>
                {partner.county && (
                  <span className="glass-chip glass-chip--slate text-xs font-semibold">
                    📍 {partner.county}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${partner.contact_email}`}
                className="glass-button glass-button--accent text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`tel:${partner.contact_phone}`}
                className="glass-button text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card glass-card--subtle shadow-glass p-5 border border-white/25 group hover:border-white/40 transition-all"
          >
            <div className={`glass-card__glow bg-gradient-to-br ${stat.gradient}`} />
            <div className="relative flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-glass-muted font-semibold mb-1 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-glass-bright">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Tabbed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Contact Info */}
        <div className="lg:col-span-1">
          <InfoSection icon={<Mail className="w-5 h-5 text-hti-teal" />} title="Contact Information">
            <InfoRow label="Contact Person" value={partner.contact_name} icon={<Users className="w-4 h-4" />} />
            <InfoRow label="Email" value={partner.contact_email} icon={<Mail className="w-4 h-4" />} link={`mailto:${partner.contact_email}`} />
            <InfoRow label="Phone" value={partner.contact_phone} icon={<Phone className="w-4 h-4" />} link={`tel:${partner.contact_phone}`} />
            {partner.address && (
              <InfoRow label="Address" value={partner.address} icon={<MapPin className="w-4 h-4" />} />
            )}
            {partner.website && (
              <InfoRow label="Website" value={partner.website} icon={<ExternalLink className="w-4 h-4" />} link={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`} />
            )}
          </InfoSection>
        </div>

        {/* Right Main Content - Tabs */}
        <div className="lg:col-span-2">
          <div className="glass-card glass-card--subtle shadow-glass overflow-hidden border border-white/25 flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="border-b glass-divider flex gap-1 p-4 bg-gradient-to-r from-white/5 to-transparent">
              {(["overview", "devices", "activity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === tab
                      ? "glass-button glass-button--accent shadow-glass"
                      : "text-glass-muted hover:text-glass-bright hover:bg-white/10"
                    }`}
                >
                  {tab === "overview" && "📋 Overview"}
                  {tab === "devices" && "💻 Devices"}
                  {tab === "activity" && "📊 Activity"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-glass-bright mb-4">Organization Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card glass-card--subtle p-4 border border-white/20">
                        <p className="text-xs font-bold text-glass-muted tracking-wide mb-2 uppercase">Organization Type</p>
                        <p className="text-xl font-bold text-glass-bright capitalize">{partner.type}</p>
                      </div>
                      <div className="glass-card glass-card--subtle p-4 border border-white/20">
                        <p className="text-xs font-bold text-glass-muted tracking-wide mb-2 uppercase">County</p>
                        <p className="text-xl font-bold text-glass-bright">{partner.county || "Unknown"}</p>
                      </div>
                      <div className="glass-card glass-card--subtle p-4 border border-white/20">
                        <p className="text-xs font-bold text-glass-muted tracking-wide mb-2 uppercase">Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${partner.status === "active" ? "bg-green-500 animate-pulse" : "bg-hti-yellow"}`} />
                          <p className="text-lg font-bold text-glass-bright capitalize">{partner.status}</p>
                        </div>
                      </div>
                      <div className="glass-card glass-card--subtle p-4 border border-white/20">
                        <p className="text-xs font-bold text-glass-muted tracking-wide mb-2 uppercase">Devices Received</p>
                        <p className="text-2xl font-bold text-hti-teal">{partner.devices_received}</p>
                      </div>
                    </div>
                  </div>

                  {partner.notes && (
                    <div className="glass-card glass-card--subtle p-5 border-l-4 border-hti-teal/50 bg-gradient-to-r from-hti-teal/10 to-transparent">
                      <h4 className="text-sm font-bold text-glass-muted tracking-wide mb-2 uppercase">Notes</h4>
                      <p className="text-sm text-glass-bright font-medium leading-relaxed whitespace-pre-wrap">{partner.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "devices" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-glass-bright mb-4">Device Distribution History</h3>
                    <div className="space-y-3">
                      {partner.devices_received > 0 ? (
                        // TODO: Replace with actual device history from API
                        [
                          { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(), devices: Math.min(partner.devices_received, 5), status: "Completed" },
                          { date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString(), devices: Math.min(Math.max(partner.devices_received - 5, 0), 3), status: "Completed" },
                        ].filter(e => e.devices > 0).map((event, idx) => (
                          <div key={idx} className="glass-card glass-card--subtle p-4 border border-white/20 flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hti-teal to-hti-navy flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                {event.devices}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-glass-bright">{event.devices} Device{event.devices > 1 ? "s" : ""} Distributed</p>
                              <p className="text-sm text-glass-muted flex items-center gap-2 mt-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {event.date}
                              </p>
                            </div>
                            <span className="glass-chip glass-chip--teal text-xs font-semibold">
                              {event.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-glass-muted">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="font-medium">No devices distributed yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-glass-bright mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {/* TODO: Replace with actual activity feed from API */}
                      <div className="glass-card glass-card--subtle p-4 border border-white/20">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-br from-hti-teal/20 to-hti-navy/10 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-hti-teal" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-glass-bright font-medium">Partnership established</p>
                            <p className="text-xs text-glass-muted mt-1">
                              {new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center py-8 text-glass-muted">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Activity feed coming soon</p>
                        <p className="text-xs mt-1">This will show real-time updates from Knack</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
