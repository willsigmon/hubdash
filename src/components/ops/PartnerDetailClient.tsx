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
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-hti-yellow/50 p-6 h-80 animate-pulse" />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-hti-yellow/50 p-6 h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <p className="text-hti-navy text-lg font-semibold">Partner not found</p>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      label: "Devices Received",
      value: partner.devices_received,
      icon: "💻",
      color: "from-hti-yellow to-hti-orange",
    },
    {
      label: "People Impacted",
      value: Math.round(partner.devices_received * 1.5), // Mock calculation
      icon: "👥",
      color: "from-hti-orange to-hti-red",
    },
    {
      label: "Programs",
      value: 3,
      icon: "📋",
      color: "from-hti-red to-hti-navy",
    },
    {
      label: "Active Status",
      value: partner.status === "active" ? "✓ Yes" : "Pending",
      icon: "✨",
      color: "from-hti-navy to-hti-gray",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Profile Container - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {/* LEFT SIDEBAR - Quick Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-br from-white to-hti-yellow/10 backdrop-blur-xl rounded-2xl border border-hti-yellow/50 p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-hti-yellow to-hti-orange flex items-center justify-center text-3xl shadow-lg">
                🏢
              </div>
            </div>
            <h2 className="text-xl font-bold text-hti-navy mb-1">{partner.name}</h2>
            <p className="text-sm text-hti-gray font-medium mb-4">{partner.type}</p>

            <div className="space-y-3 border-t border-hti-yellow/50 pt-4">
              <div className="text-sm">
                <p className="text-hti-navy font-medium">Contact</p>
                <p className="text-hti-navy font-bold">{partner.contact_name}</p>
              </div>
              <div className="text-sm">
                <p className="text-hti-navy font-medium">Email</p>
                <p className="text-hti-orange font-semibold text-xs break-all">{partner.contact_email}</p>
              </div>
              <div className="text-sm">
                <p className="text-hti-navy font-medium">Phone</p>
                <p className="text-hti-navy font-bold">{partner.contact_phone}</p>
              </div>
              <div className="text-sm">
                <p className="text-hti-navy font-medium">County</p>
                <p className="text-hti-navy font-bold">{partner.county || "Unknown"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button className="px-3 py-2 bg-gradient-to-r from-hti-yellow to-hti-orange hover:shadow-lg text-hti-navy font-bold rounded-lg text-sm transition-all hover:scale-105">
                Schedule
              </button>
              <button className="px-3 py-2 bg-white border border-hti-orange text-hti-orange hover:bg-hti-orange/10 font-bold rounded-lg text-sm transition-all">
                Message
              </button>
            </div>
          </div>

          {/* Quick Stats Vertical Cards */}
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-white to-hti-orange/5 backdrop-blur-xl rounded-xl border border-hti-yellow/50 p-4 shadow-lg hover:shadow-xl hover:border-hti-yellow/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-hti-navy font-semibold">{stat.label}</p>
                    <p className="text-2xl font-bold text-hti-navy">{stat.value}</p>
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full mt-3`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT - Tabbed Details */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-white via-hti-yellow/3 to-hti-orange/5 backdrop-blur-xl rounded-2xl border border-hti-yellow/50 shadow-xl h-full flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-hti-yellow/50 flex gap-1 p-4">
              {(["organization", "details", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-hti-yellow to-hti-orange text-hti-navy shadow-lg"
                      : "bg-white/40 text-hti-gray hover:bg-white/60 border border-hti-yellow/50"
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
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-hti-yellow/50">
                      <p className="text-xs font-bold text-hti-navy uppercase tracking-wider mb-2">Organization Type</p>
                      <p className="text-2xl font-bold text-hti-navy capitalize">{partner.type}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-hti-yellow/50">
                      <p className="text-xs font-bold text-hti-navy uppercase tracking-wider mb-2">County</p>
                      <p className="text-2xl font-bold text-hti-navy">{partner.county || "Unknown"}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-hti-yellow/50">
                      <p className="text-xs font-bold text-hti-navy uppercase tracking-wider mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${partner.status === "active" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
                        <p className="text-lg font-bold text-hti-navy capitalize">{partner.status}</p>
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-hti-yellow/50">
                      <p className="text-xs font-bold text-hti-navy uppercase tracking-wider mb-2">Devices Received</p>
                      <p className="text-2xl font-bold text-hti-orange">{partner.devices_received}</p>
                    </div>
                  </div>
                  {partner.notes && (
                    <div className="bg-hti-yellow/15 border-l-4 border-hti-yellow rounded-lg p-4">
                      <p className="text-sm text-hti-navy font-medium leading-relaxed">{partner.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-hti-yellow/50">
                    <h3 className="text-lg font-bold text-hti-navy mb-4">Client Population & Needs</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-bold text-hti-navy mb-2">Works With</p>
                        <div className="flex flex-wrap gap-2">
                          {["Adults", "Families", "Job Seekers"].map((group) => (
                            <span key={group} className="px-3 py-1 bg-hti-yellow/20 border border-hti-yellow/50 text-hti-navy rounded-full text-xs font-bold">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-hti-navy mb-2">Struggles Being Addressed</p>
                        <div className="flex flex-wrap gap-2">
                          {["Digital Literacy", "Access", "Employment"].map((struggle) => (
                            <span key={struggle} className="px-3 py-1 bg-hti-orange/20 border border-hti-orange/50 text-hti-navy rounded-full text-xs font-bold">
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
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-hti-yellow/50">
                    <h3 className="text-lg font-bold text-hti-navy mb-4">Distribution Timeline</h3>
                    <div className="space-y-4">
                      {[
                        { date: "Oct 2024", devices: 1, status: "Completed" },
                        { date: "Aug 2024", devices: 2, status: "Completed" },
                        { date: "Jun 2024", devices: 1, status: "Completed" },
                      ].map((event, idx) => (
                        <div key={idx} className="flex items-center gap-4 pb-4 border-b border-hti-yellow/20 last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hti-yellow to-hti-orange flex items-center justify-center text-lg font-bold text-hti-navy">
                              {event.devices}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-hti-navy">{event.devices} Device{event.devices > 1 ? "s" : ""}</p>
                            <p className="text-sm text-hti-gray">{event.date}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-bold border border-green-500/30">
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
