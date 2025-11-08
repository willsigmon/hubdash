"use client";

import { Building, Calendar, CheckCircle, Package, Truck, User, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import GradientHeading from "../ui/GradientHeading";

interface TimelineEvent {
  id: string;
  status: string;
  date: string;
  timestamp?: string;
  technician?: string;
  partner?: string;
  notes?: string;
}

interface DeviceJourneyProps {
  deviceId: string;
  serialNumber: string;
  deviceType: string;
  onClose: () => void;
}

const JOURNEY_STAGES = [
  {
    status: "Donated",
    icon: Package,
    bgClass: "bg-soft-accent",
    borderClass: "border-accent/30",
  },
  {
    status: "Received",
    icon: CheckCircle,
    bgClass: "bg-soft-accent",
    borderClass: "border-accent/30",
  },
  {
    status: "Testing",
    icon: Wrench,
    bgClass: "bg-soft-warning",
    borderClass: "border-warning/30",
  },
  {
    status: "Ready",
    icon: CheckCircle,
    bgClass: "bg-soft-success",
    borderClass: "border-success/30",
  },
  {
    status: "Deployed",
    icon: Truck,
    bgClass: "bg-soft-success",
    borderClass: "border-success/30",
  },
];

export function DeviceJourneyTimeline({ deviceId, serialNumber, deviceType, onClose }: DeviceJourneyProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch actual timeline from API
    // For now, simulate with sample data
    const simulateTimeline = () => {
      const sampleEvents: TimelineEvent[] = [
        {
          id: "1",
          status: "Donated",
          date: "2024-10-15",
          timestamp: "09:30 AM",
          notes: "Device donated by local business during community drive",
        },
        {
          id: "2",
          status: "Received",
          date: "2024-10-16",
          timestamp: "02:15 PM",
          technician: "Sarah Martinez",
          notes: "Initial inspection completed - good condition",
        },
        {
          id: "3",
          status: "Testing",
          date: "2024-10-17",
          timestamp: "10:45 AM",
          technician: "James Wilson",
          notes: "Hardware diagnostics passed, RAM upgraded to 8GB",
        },
        {
          id: "4",
          status: "Cleaning",
          date: "2024-10-18",
          timestamp: "11:20 AM",
          technician: "Maria Garcia",
          notes: "Deep clean and software installation completed",
        },
        {
          id: "5",
          status: "Ready",
          date: "2024-10-19",
          timestamp: "03:00 PM",
          technician: "Sarah Martinez",
          notes: "Quality check passed - ready for deployment",
        },
        {
          id: "6",
          status: "Deployed",
          date: "2024-10-22",
          timestamp: "01:30 PM",
          partner: "Travis County Library System",
          notes: "Deployed to community center for public access",
        },
      ];

      setTimeout(() => {
        setEvents(sampleEvents);
        setLoading(false);
      }, 500);
    };

    simulateTimeline();
  }, [deviceId]);

  const getStageInfo = (status: string) => {
    return JOURNEY_STAGES.find(s => s.status === status) || JOURNEY_STAGES[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="relative" variant="translucent">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-surface backdrop-blur-xl p-6 border-b border-default">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-surface-alt hover:bg-surface transition-colors border border-default"
            >
              <X className="w-5 h-5 text-primary" />
            </button>

            <GradientHeading className="text-3xl mb-2" variant="accent">
              Device Journey
            </GradientHeading>
            <div className="flex items-center gap-4 text-secondary text-sm">
              <span className="font-mono text-primary">{serialNumber}</span>
              <span className="text-muted">•</span>
              <span className="text-primary">{deviceType}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse h-24" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                No timeline events found for this device
              </div>
            ) : (
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent" />

                {/* Events */}
                <div className="space-y-6">
                  {events.map((event, index) => {
                    const stageInfo = getStageInfo(event.status);
                    const Icon = stageInfo.icon;
                    const isLast = index === events.length - 1;

                    return (
                      <div
                        key={event.id}
                        className="relative pl-20 group animate-in slide-in-from-left duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Icon Circle */}
                        <div className={`absolute left-0 w-16 h-16 rounded-full ${stageInfo.bgClass} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border ${stageInfo.borderClass}`}>
                          <Icon className="w-8 h-8 text-primary" />
                        </div>

                        {/* Event Card */}
                        <div className={`bg-surface hover:bg-surface-alt rounded-xl p-4 border ${stageInfo.borderClass} transition-all ${isLast ? 'ring-2 ring-success/30' : ''}`}>
                          {/* Status & Date */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-primary font-semibold text-lg flex items-center gap-2">
                                {event.status}
                                {isLast && (
                                  <span className="px-2 py-1 bg-soft-success text-success text-xs rounded-full border border-success/30 animate-pulse">
                                    Current Status
                                  </span>
                                )}
                              </h4>
                              <div className="flex items-center gap-2 text-secondary text-sm mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                                {event.timestamp && (
                                  <>
                                    <span className="text-muted">•</span>
                                    <span>{event.timestamp}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          {(event.technician || event.partner || event.notes) && (
                            <div className="mt-3 space-y-2">
                              {event.technician && (
                                <div className="flex items-center gap-2 text-secondary text-sm">
                                  <User className="w-4 h-4 text-accent" />
                                  <span className="font-medium text-primary">Technician:</span>
                                  <span className="text-primary">{event.technician}</span>
                                </div>
                              )}
                              {event.partner && (
                                <div className="flex items-center gap-2 text-secondary text-sm">
                                  <Building className="w-4 h-4 text-accent" />
                                  <span className="font-medium text-primary">Partner:</span>
                                  <span className="text-primary">{event.partner}</span>
                                </div>
                              )}
                              {event.notes && (
                                <div className="text-secondary text-sm italic mt-2 pl-6 border-l-2 border-default">
                                  {event.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-6 border-t border-default bg-surface-alt grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{events.length}</div>
              <div className="text-xs text-secondary uppercase tracking-wider">Timeline Events</div>
            </div>
            <div className="text-center border-l border-r border-default">
              <div className="text-2xl font-bold text-accent">
                {events.length > 0 ? Math.ceil((new Date(events[events.length - 1].date).getTime() - new Date(events[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">Days in System</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {events.find(e => e.status === "Deployed") ? "✓" : "⏳"}
              </div>
              <div className="text-xs text-secondary uppercase tracking-wider">Deployment Status</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
