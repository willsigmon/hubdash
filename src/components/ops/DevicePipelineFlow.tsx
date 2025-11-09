"use client";

import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import {
    Archive,
    CheckCircle,
    ChevronRight,
    Filter,
    Package,
    Truck,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GlassCard from "../ui/GlassCard";

interface DeviceStats {
  total: number;
  unassigned: number;
  assigned: number;
  converted: number;
  presented: number;
  discarded: number;
}

const WORKFLOW_STAGES = [
  {
    key: "unassigned" as const,
    label: "Unassigned/Ready",
    description: "Devices ready for technician assignment",
    icon: Package,
    color: "accent-gradient",
    bgColor: "bg-soft-accent",
    textColor: "text-accent",
    borderColor: "border-accent",
    route: "/ops/devices/unassigned"
  },
  {
    key: "assigned" as const,
    label: "Assigned",
    description: "In process with technicians",
    icon: Wrench,
    color: "accent-gradient",
    bgColor: "bg-soft-warning",
    textColor: "text-warning",
    borderColor: "border-warning",
    route: "/ops/devices/assigned"
  },
  {
    key: "converted" as const,
    label: "Converted/Ready",
    description: "Ready to be presented",
    icon: CheckCircle,
    color: "accent-gradient",
    bgColor: "bg-soft-accent",
    textColor: "text-accent",
    borderColor: "border-accent",
    route: "/ops/devices/converted"
  },
  {
    key: "presented" as const,
    label: "Presented",
    description: "Donated to recipients",
    icon: Truck,
    color: "accent-gradient",
    bgColor: "bg-soft-success",
    textColor: "text-success",
    borderColor: "border-success",
    route: "/ops/devices/presented"
  },
  {
    key: "discarded" as const,
    label: "Discarded",
    description: "Marked for eCycling",
    icon: Archive,
    color: "accent-gradient",
    bgColor: "bg-soft-danger",
    textColor: "text-danger",
    borderColor: "border-danger",
    route: "/ops/devices/discarded"
  },
];

export default function DevicePipelineFlow() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const { data: stats, isLoading } = useQuery<DeviceStats>({
    queryKey: queryKeys.devices,
    queryFn: async () => {
      try {
        // Fetch all devices from Knack API
        const res = await fetch('/api/devices?limit=1000&page=1');
        if (!res.ok) {
          throw new Error('Failed to fetch devices');
        }
        const data = await res.json();
        const devices = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

        // Aggregate by status
        const statusCounts: Record<string, number> = {};
        let total = 0;

        devices.forEach((device: any) => {
          total++;
          const status = device.status?.toLowerCase() || 'unknown';
          
          // Map statuses to pipeline stages
          if (status.includes('unassigned') || status.includes('ready') || status.includes('donated') || status.includes('received')) {
            statusCounts.unassigned = (statusCounts.unassigned || 0) + 1;
          } else if (status.includes('assigned') || status.includes('in process') || status.includes('refurbishing')) {
            statusCounts.assigned = (statusCounts.assigned || 0) + 1;
          } else if (status.includes('converted') || status.includes('ready to ship') || status.includes('qa testing')) {
            statusCounts.converted = (statusCounts.converted || 0) + 1;
          } else if (status.includes('presented') || status.includes('distributed') || status.includes('completed')) {
            statusCounts.presented = (statusCounts.presented || 0) + 1;
          } else if (status.includes('discarded') || status.includes('recycled') || status.includes('ecle')) {
            statusCounts.discarded = (statusCounts.discarded || 0) + 1;
          } else {
            // Default to unassigned for unknown statuses
            statusCounts.unassigned = (statusCounts.unassigned || 0) + 1;
          }
        });

        return {
          total,
          unassigned: statusCounts.unassigned || 0,
          assigned: statusCounts.assigned || 0,
          converted: statusCounts.converted || 0,
          presented: statusCounts.presented || 0,
          discarded: statusCounts.discarded || 0,
        };
      } catch (error) {
        console.error('Error fetching device stats:', error);
        // Return zeros on error
        return {
          total: 0,
          unassigned: 0,
          assigned: 0,
          converted: 0,
          presented: 0,
          discarded: 0,
        };
      }
    },
  });

  if (isLoading) {
    return (
      <GlassCard>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface-alt rounded" />
          <div className="grid grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-32 bg-surface-alt rounded-xl" />
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-primary mb-1">
          Device Pipeline Workflow
        </h3>
        <p className="text-secondary text-xs">
          Track devices through the complete lifecycle from donation to presentation
        </p>
      </div>

        {/* Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          {WORKFLOW_STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const count = stats?.[stage.key] || 0;
            const isSelected = selectedStage === stage.key;

            return (
              <div key={stage.key} className="relative">
                {/* Connector Arrow */}
                {index < WORKFLOW_STAGES.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 z-10 transform translate-x-1/2 -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-muted" />
                  </div>
                )}

                <Link href={stage.route}>
                  <div
                    className={`group relative cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-105'
                    }`}
                    onMouseEnter={() => setSelectedStage(stage.key)}
                    onMouseLeave={() => setSelectedStage(null)}
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 ${stage.color} rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />

                    {/* Card */}
                    <div className={`relative bg-surface rounded-xl p-4 border-2 ${stage.borderColor} ${stage.bgColor} transition-all shadow-sm group-hover:shadow-xl`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg ${stage.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-6 h-6 text-on-accent" />
                      </div>

                      {/* Count */}
                      <div className="text-3xl font-bold text-primary mb-1">
                        {typeof count === 'number' ? count.toLocaleString() : '—'}
                      </div>

                      {/* Label */}
                      <div className={`font-semibold ${stage.textColor} text-sm mb-1`}>
                        {stage.label}
                      </div>

                      {/* Description */}
                      <div className="text-xs text-muted">
                        {stage.description}
                      </div>

                      {/* Hover indicator */}
                      <div className="mt-3 flex items-center gap-1 text-xs text-secondary group-hover:text-primary transition-colors">
                        <span>View details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-default">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
                {typeof stats?.total === 'number' ? stats.total.toLocaleString() : "—"}
              </div>
            <div className="text-xs text-secondary uppercase tracking-wider">
              Total Devices
            </div>
          </div>
          <div className="text-center border-l border-r border-default">
            <div className="text-2xl font-bold text-accent">
              {typeof window !== 'undefined' ? ((stats?.assigned || 0) + (stats?.converted || 0)).toLocaleString() : '—'}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wider">
              In Progress
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {((stats?.presented || 0) / (stats?.total || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-secondary uppercase tracking-wider">
              Deployment Rate
            </div>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link href="/ops/devices/unassigned">
          <GlassCard className="hover:border-accent/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-accent rounded-lg">
                <Filter className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-primary group-hover:text-accent transition-colors">
                  Devices Needing Assignment
                </div>
                <div className="text-xs text-secondary">
                  {stats?.unassigned} devices ready
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/ops/devices/converted">
          <GlassCard className="hover:border-accent/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-accent rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-primary group-hover:text-accent transition-colors">
                  Ready for Presentation
                </div>
                <div className="text-xs text-secondary">
                  {stats?.converted} devices converted
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/ops/devices/discarded">
          <GlassCard className="hover:border-danger/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft-danger rounded-lg">
                <Archive className="w-5 h-5 text-danger" />
              </div>
              <div>
                <div className="font-semibold text-primary group-hover:text-danger transition-colors">
                  Review Discarded Devices
                </div>
                <div className="text-xs text-secondary">
                  {stats?.discarded} for eCycling
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
