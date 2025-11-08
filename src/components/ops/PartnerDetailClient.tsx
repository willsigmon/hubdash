"use client";

import { useEffect, useState } from "react";

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
}

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function PartnerDetailClient({ partnerId }: { partnerId: string }) {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [activeTab, setActiveTab] = useState<"organization" | "details" | "history">("organization");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch partner data
    fetch(`/api/partners`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: PartnerData) => p.id === partnerId);
        if (found) {
          setPartner(found);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching partner:', error);
        setLoading(false);
      });
  }, [partnerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-surface-alt rounded-2xl border border-default p-6 h-80 animate-pulse" />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-surface-alt rounded-2xl border border-default p-6 h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <p className="text-primary text-lg font-semibold">Partner not found</p>
      </div>
    );
  }

  const stats: StatCard[] = [
    { label: "Devices Received", value: partner.devices_received, icon: "💻", color: "accent-gradient" },
    { label: "People Impacted", value: Math.round(partner.devices_received * 1.5), icon: "👥", color: "accent-gradient" },
    { label: "Programs", value: 3, icon: "📋", color: "accent-gradient" },
    { label: "Active Status", value: partner.status === "active" ? "✓ Yes" : "Pending", icon: "✨", color: "accent-gradient" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Profile Container - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {/* LEFT SIDEBAR - Quick Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Header Card */}
          <div className="bg-surface rounded-2xl border border-default p-6 shadow hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-xl accent-gradient flex items-center justify-center text-3xl shadow-lg">
                🏢
              </div>
            </div>
            <h2 className="text-xl font-bold text-primary mb-1">{partner.name}</h2>
            <p className="text-sm text-secondary font-medium mb-4">{partner.type}</p>

            <div className="space-y-3 border-t border-default pt-4">
              <div className="text-sm">
                <p className="text-secondary font-medium">Contact</p>
                <p className="text-primary font-bold">{partner.contact_name}</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary font-medium">Email</p>
                <p className="text-accent font-semibold text-xs break-all">{partner.contact_email}</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary font-medium">Phone</p>
                <p className="text-primary font-bold">{partner.contact_phone}</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary font-medium">County</p>
                <p className="text-primary font-bold">{partner.county || "Unknown"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button className="px-3 py-2 accent-gradient hover:shadow-lg text-white font-bold rounded-lg text-sm transition-all hover:scale-105">
                Schedule
              </button>
              <button className="px-3 py-2 bg-soft-accent text-accent border border-accent/30 hover:bg-soft-accent/70 font-bold rounded-lg text-sm transition-all">
                Message
              </button>
            </div>
          </div>

          {/* Quick Stats Vertical Cards */}
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-alt rounded-xl border border-default p-4 shadow-sm hover:shadow-md hover:border-strong transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary font-semibold">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                </div>
                <div className={`h-1 ${stat.color} rounded-full mt-3`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT - Tabbed Details */}
        <div className="lg:col-span-3">
          <div className="bg-surface-alt rounded-2xl border border-default shadow h-full flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-default flex gap-1 p-4">
              {(["organization", "details", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab
                      ? "accent-gradient text-white shadow"
                      : "bg-surface text-secondary hover:bg-surface-alt border border-default"
                  }`}
                >
                  {tab === "organization" && "🏢 Organization"}
                  {tab === "details" && "📋 Details"}
                  {tab === "history" && "📊 History"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "organization" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface rounded-xl p-4 border border-default">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Organization Type</p>
                      <p className="text-2xl font-bold text-primary capitalize">{partner.type}</p>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-default">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">County</p>
                      <p className="text-2xl font-bold text-primary">{partner.county || "Unknown"}</p>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-default">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${partner.status === "active" ? "bg-success" : "bg-warning"} animate-pulse`} />
                        <p className="text-lg font-bold text-primary capitalize">{partner.status}</p>
                      </div>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-default">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Devices Received</p>
                      <p className="text-2xl font-bold text-accent">{partner.devices_received}</p>
                    </div>
                  </div>
                  {partner.notes && (
                    <div className="bg-soft-accent border-l-4 border-accent rounded-lg p-4">
                      <p className="text-sm text-secondary font-medium leading-relaxed">{partner.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="bg-surface rounded-xl p-6 border border-default">
                    <h3 className="text-lg font-bold text-primary mb-4">Client Population & Needs</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-bold text-secondary mb-2">Works With</p>
                        <div className="flex flex-wrap gap-2">
                          {["Adults", "Families", "Job Seekers"].map((group) => (
                            <span key={group} className="px-3 py-1 bg-soft-accent border border-accent/30 text-accent rounded-full text-xs font-bold">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary mb-2">Struggles Being Addressed</p>
                        <div className="flex flex-wrap gap-2">
                          {["Digital Literacy", "Access", "Employment"].map((struggle) => (
                            <span key={struggle} className="px-3 py-1 bg-soft-warning border border-warning/30 text-warning rounded-full text-xs font-bold">
                              {struggle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="bg-surface rounded-xl p-6 border border-default">
                    <h3 className="text-lg font-bold text-primary mb-4">Distribution Timeline</h3>
                    <div className="space-y-4">
                      {[
                        { date: "Oct 2024", devices: 1, status: "Completed" },
                        { date: "Aug 2024", devices: 2, status: "Completed" },
                        { date: "Jun 2024", devices: 1, status: "Completed" },
                      ].map((event, idx) => (
                        <div key={idx} className="flex items-center gap-4 pb-4 border-b border-default last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center text-lg font-bold text-white">
                              {event.devices}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-primary">{event.devices} Device{event.devices > 1 ? "s" : ""}</p>
                            <p className="text-sm text-secondary">{event.date}</p>
                          </div>
                          <span className="px-3 py-1 bg-soft-success text-success rounded-full text-xs font-bold border border-success/40">
                            {event.status}
                          </span>
                        </div>
                      ))}
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
