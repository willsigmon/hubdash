"use client";

import { queryKeys } from "@/lib/query-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Building,
    Calendar,
    Edit2,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    TrendingUp,
    Users
} from "lucide-react";
import { useState } from "react";
import GlassCard from "../ui/GlassCard";
import GradientHeading from "../ui/GradientHeading";

interface RecipientOrg {
  id: string;
  name: string;
  focusAreas: string[];
  county: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  totalDevicesReceived: number;
  lastPresentation?: string;
  status: "Active" | "Inactive" | "Pending";
  notes?: string;
}

const FOCUS_AREAS = [
  "After School Programs",
  "Autism Support",
  "Education",
  "Employment Training",
  "Health & Wellness",
  "Housing/Homeless",
  "Hunger Relief",
  "Immigration Services",
  "Legal Aid",
  "Senior Services",
  "Veterans Support",
  "Youth Development",
];

const FOCUS_AREA_COLORS: Record<string, string> = {
  "After School Programs": "bg-soft-accent text-accent",
  "Autism Support": "bg-soft-accent text-accent",
  "Education": "bg-soft-accent text-accent",
  "Employment Training": "bg-soft-accent text-accent",
  "Health & Wellness": "bg-soft-accent text-accent",
  "Housing/Homeless": "bg-soft-accent text-accent",
  "Hunger Relief": "bg-soft-accent text-accent",
  "Immigration Services": "bg-soft-accent text-accent",
  "Legal Aid": "bg-soft-accent text-accent",
  "Senior Services": "bg-soft-accent text-accent",
  "Veterans Support": "bg-soft-accent text-accent",
  "Youth Development": "bg-soft-accent text-accent",
};

export default function RecipientOrganizations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [focusFilter, setFocusFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: orgs, isLoading } = useQuery<RecipientOrg[]>({
    queryKey: queryKeys.devices, // TODO: Create queryKeys.organizations
    queryFn: async () => {
      // In production: GET /api/organizations
      // Mock data
      return [
        {
          id: "1",
          name: "Baltimore Community Center",
          focusAreas: ["After School Programs", "Youth Development"],
          county: "Baltimore City",
          contactName: "Maria Garcia",
          email: "maria@bcc.org",
          phone: "(410) 555-1234",
          address: "123 Main St, Baltimore, MD 21201",
          totalDevicesReceived: 45,
          lastPresentation: "2024-01-10",
          status: "Active",
        },
        {
          id: "2",
          name: "Autism Support Network",
          focusAreas: ["Autism Support", "Education"],
          county: "Montgomery",
          contactName: "David Chen",
          email: "dchen@asn.org",
          phone: "(301) 555-5678",
          totalDevicesReceived: 28,
          lastPresentation: "2023-12-15",
          status: "Active",
        },
        {
          id: "3",
          name: "Hope House",
          focusAreas: ["Housing/Homeless", "Employment Training"],
          county: "Anne Arundel",
          contactName: "Jennifer Smith",
          email: "jsmith@hopehouse.org",
          phone: "(410) 555-9012",
          totalDevicesReceived: 67,
          lastPresentation: "2024-01-05",
          status: "Active",
          notes: "Excellent partner - always responsive",
        },
      ];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newOrg: Partial<RecipientOrg>) => {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify(newOrg),
      });
      if (!res.ok) throw new Error("Failed to create organization");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RecipientOrg> }) => {
      const res = await fetch(`/api/organizations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update organization");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete organization");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const counties = Array.from(new Set((orgs || []).map(o => o.county))).sort();

  const filteredOrgs = (orgs || [])
    .filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCounty = countyFilter === "all" || org.county === countyFilter;
      const matchesFocus =
        focusFilter === "all" || org.focusAreas.includes(focusFilter);
      const matchesStatus = statusFilter === "all" || org.status === statusFilter;
      return matchesSearch && matchesCounty && matchesFocus && matchesStatus;
    })
    .sort((a, b) => b.totalDevicesReceived - a.totalDevicesReceived);

  const totalDevices = filteredOrgs.reduce((sum, org) => sum + org.totalDevicesReceived, 0);
  const avgDevices = filteredOrgs.length > 0 ? totalDevices / filteredOrgs.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <GradientHeading variant="navy" className="text-3xl">
          Recipient Organizations
        </GradientHeading>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 accent-gradient text-on-accent rounded-lg font-semibold hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{filteredOrgs.length}</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Total Partners</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">
              {filteredOrgs.filter(o => o.status === "Active").length}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wider">Active</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">{totalDevices}</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Devices Presented</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">{avgDevices.toFixed(0)}</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Avg per Partner</div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
            />
          </div>

          {/* County Filter */}
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
          >
            <option value="all">All Counties</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

          {/* Focus Area Filter */}
          <select
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
            className="px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
          >
            <option value="all">All Focus Areas</option>
            {FOCUS_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </GlassCard>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <GlassCard key={i}>
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-surface-alt rounded w-3/4" />
                  <div className="h-4 bg-surface-alt rounded w-1/2" />
                  <div className="h-20 bg-surface-alt rounded" />
                </div>
              </GlassCard>
            ))}
          </>
        ) : filteredOrgs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-secondary text-lg">No organizations found</p>
          </div>
        ) : (
          filteredOrgs.map((org) => (
            <GlassCard key={org.id} className="hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 accent-gradient rounded-lg">
                    <Building className="w-6 h-6 text-on-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{org.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <MapPin className="w-4 h-4" />
                      {org.county} County
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      org.status === "Active"
                        ? "bg-soft-success text-success"
                        : org.status === "Pending"
                        ? "bg-soft-warning text-warning"
                        : "bg-soft-danger text-danger"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="mb-4">
                <div className="text-xs text-muted uppercase tracking-wider mb-2">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {org.focusAreas.map((area) => (
                    <span
                      key={area}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        FOCUS_AREA_COLORS[area] || "bg-soft-accent text-accent"
                      }`}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              {org.contactName && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Users className="w-4 h-4" />
                    {org.contactName}
                  </div>
                  {org.email && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${org.email}`}
                        className="hover:text-accent transition-colors"
                      >
                        {org.email}
                      </a>
                    </div>
                  )}
                  {org.phone && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Phone className="w-4 h-4" />
                      {org.phone}
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-default">
                <div>
                  <div className="flex items-center gap-2 text-2xl font-bold text-accent mb-1">
                    <TrendingUp className="w-5 h-5" />
                    {org.totalDevicesReceived}
                  </div>
                  <div className="text-xs text-secondary">Devices Received</div>
                </div>
                {org.lastPresentation && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-secondary mb-1">
                      <Calendar className="w-4 h-4" />
                      {org.lastPresentation}
                    </div>
                    <div className="text-xs text-muted">Last Presentation</div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {org.notes && (
                <div className="mt-4 p-3 bg-soft-accent rounded-lg border border-accent">
                  <div className="text-xs text-secondary italic">{org.notes}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-alt hover:bg-surface rounded-lg text-sm font-medium text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${org.name}?`)) {
                      deleteMutation.mutate(org.id);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-soft-danger hover:bg-soft-danger rounded-lg text-sm font-medium text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-primary mb-4">Add Organization</h3>
            <p className="text-secondary text-sm mb-4">
              Create form coming soon - full CRUD implementation
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 bg-surface-alt text-secondary rounded-lg font-semibold hover:bg-surface transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
