"use client";

import { use } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Package, User, Phone, Mail, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils/date-formatters";

interface DonationDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Donation {
  id: string;
  company: string;
  contact_name: string;
  contact_email: string;
  device_count: number;
  location: string;
  status: string;
  requested_date: string;
}

export default function DonationDetailPage({ params }: DonationDetailPageProps) {
  const { id } = use(params);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/donations/${id}`)
      .then(res => res.json())
      .then(data => {
        setDonation(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching donation:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app">
        <header className="bg-surface border-b border-default text-primary shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Donation Details</h1>
                <p className="text-lg font-medium text-secondary">Loading...</p>
              </div>
              <Link
                href="/ops"
                className="px-6 py-3 accent-gradient text-on-accent rounded-lg transition-all duration-200 text-sm font-semibold shadow hover:-translate-y-0.5"
              >
                ← Back to Ops
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-surface rounded-2xl border border-default p-8 shadow-lg animate-pulse">
            <div className="h-8 bg-surface-alt rounded w-1/3 mb-4" />
            <div className="h-4 bg-surface-alt rounded w-2/3" />
          </div>
        </main>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-app">
        <header className="bg-surface border-b border-default text-primary shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Donation Not Found</h1>
              </div>
              <Link
                href="/ops"
                className="px-6 py-3 accent-gradient text-on-accent rounded-lg transition-all duration-200 text-sm font-semibold shadow hover:-translate-y-0.5"
              >
                ← Back to Ops
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-surface rounded-2xl border border-default p-8 shadow-lg text-center">
            <p className="text-secondary mb-4">Donation not found</p>
            <Link href="/ops" className="text-accent hover:underline">
              Return to Operations
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <header className="bg-surface border-b border-default text-primary shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">{donation.company}</h1>
              <p className="text-lg font-medium text-secondary">
                Donation Request Details
              </p>
            </div>
            <Link
              href="/ops"
              className="px-6 py-3 accent-gradient text-on-accent rounded-lg transition-all duration-200 text-sm font-semibold shadow hover:-translate-y-0.5"
            >
              ← Back to Ops
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl border border-default p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-primary mb-4">Donation Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Company</div>
                  <div className="text-lg font-bold text-primary">{donation.company}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Contact</div>
                  <div className="text-lg font-semibold text-primary">{donation.contact_name}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Email</div>
                  <div className="text-primary">{donation.contact_email}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Location</div>
                  <div className="text-primary">{donation.location}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Device Count</div>
                  <div className="text-2xl font-bold text-accent">{donation.device_count}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary mb-1">Status</div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                    donation.status === 'scheduled'
                      ? 'bg-soft-success text-success border border-success'
                      : donation.status === 'in_progress'
                      ? 'bg-soft-warning text-warning border border-warning'
                      : 'bg-soft-accent text-accent border border-accent'
                  }`}>
                    {donation.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface rounded-2xl border border-default p-6 shadow-lg">
              <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 accent-gradient text-on-accent rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all">
                  <Calendar className="w-4 h-4" />
                  Schedule Pickup
                </button>
                <Link
                  href={`mailto:${donation.contact_email}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border-2 border-default text-primary rounded-lg text-sm font-semibold hover:bg-surface-alt transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </Link>
              </div>
            </div>
            <div className="bg-surface rounded-2xl border border-default p-6 shadow-lg">
              <div className="text-sm font-semibold text-secondary mb-2">Requested Date</div>
              <div className="text-primary font-medium">{formatDate(donation.requested_date)}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

