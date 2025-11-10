"use client";

import { Calendar, MapPin, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import GradientHeading from "../ui/GradientHeading";

interface Partner {
  id: string;
  name: string;
  email?: string;
  devices_received?: number;
  partnership_type?: string;
}

interface CountyDetailModalProps {
  countyName: string;
  totalDevices: number;
  onClose: () => void;
  onFilterByCounty?: (county: string) => void;
}

export function CountyDetailModal({
  countyName,
  totalDevices,
  onClose,
  onFilterByCounty
}: CountyDetailModalProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch partners in this county
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        const countyPartners = data.filter((p: any) => p.county === countyName);
        setPartners(countyPartners);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching county partners:', err);
        setLoading(false);
      });
  }, [countyName]);

  const avgDevicesPerPartner = partners.length > 0
    ? Math.round(totalDevices / partners.length)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="relative" variant="translucent">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-xl p-6 border-b border-default">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-soft-accent hover:bg-soft-warning transition-colors"
            >
              <X className="w-5 h-5 text-accent" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-soft-accent rounded-xl border border-accent">
                <MapPin className="w-8 h-8 text-accent-alt" />
              </div>
              <div className="flex-1">
                <GradientHeading className="text-3xl mb-2" variant="accent">
                  {countyName} County
                </GradientHeading>
                <p className="text-muted text-sm">
                  Deep dive into partnership activity and impact metrics
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-default">
            <div className="bg-surface-alt rounded-xl p-4 border border-default">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted uppercase tracking-wider">Total Devices</span>
              </div>
              <div className="text-3xl font-bold text-primary">{totalDevices}</div>
            </div>

            <div className="bg-surface-alt rounded-xl p-4 border border-default">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-accent-alt" />
                <span className="text-xs text-muted uppercase tracking-wider">Active Partners</span>
              </div>
              <div className="text-3xl font-bold text-primary">{partners.length}</div>
            </div>

            <div className="bg-surface-alt rounded-xl p-4 border border-default">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-warning" />
                <span className="text-xs text-muted uppercase tracking-wider">Avg per Partner</span>
              </div>
              <div className="text-3xl font-bold text-primary">{avgDevicesPerPartner}</div>
            </div>
          </div>

          {/* Partners List */}
          <div className="p-6">
            <h4 className="text-primary font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-alt" />
              Partners in {countyName} County
            </h4>

            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-surface-alt rounded-lg p-4 animate-pulse h-20 border border-default" />
                ))}
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12 text-muted">
                No partners found in this county
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {partners.map(partner => (
                  <div
                    key={partner.id}
                    className="bg-surface-alt hover:bg-surface rounded-lg p-4 border border-default hover:border-accent transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-primary font-semibold mb-1">{partner.name}</h5>
                        {partner.email && (
                          <p className="text-muted text-sm">{partner.email}</p>
                        )}
                        {partner.partnership_type && (
                          <span className="inline-block mt-2 px-2 py-1 bg-soft-accent text-accent-alt text-xs rounded-full border border-accent">
                            {partner.partnership_type}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">
                          {partner.devices_received || 0}
                        </div>
                        <div className="text-xs text-muted">devices</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {onFilterByCounty && (
            <div className="p-6 border-t border-default bg-surface-alt">
              <button
                onClick={() => {
                  onFilterByCounty(countyName);
                  onClose();
                }}
                className="w-full px-6 py-3 accent-gradient text-primary font-semibold rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Filter All Dashboards by {countyName} County
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
