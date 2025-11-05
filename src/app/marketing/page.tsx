"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Partnership {
  id: string;
  organizationName: string;
  status: string;
  contactPerson: string;
  email: string;
  county: string;
  chromebooksNeeded: number;
  howWillUse: string;
  positiveImpact: string;
  clientStruggles: string[];
  timestamp: string;
  quote: string;
  is501c3: boolean;
}

interface Recipient {
  id: string;
  name: string;
  county: string;
  occupation: string;
  status: string;
  datePresented: string | null;
  quote: string;
  reasonForApplication: string;
}

export default function MarketingPage() {
  const [filter, setFilter] = useState<'pending' | 'recent' | 'all'>('pending');
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/partnerships?filter=${filter}`).then(r => r.json()),
      fetch(`/api/recipients?filter=${filter === 'pending' ? 'all' : filter}`).then(r => r.json())
    ])
      .then(([partData, recData]) => {
        setPartnerships(partData);
        setRecipients(recData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading marketing data:', error);
        setLoading(false);
      });
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Marketing Hub</h1>
              <p className="text-white/90 text-lg">
                Recipient stories and partnership applications for impact marketing
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Pending Applications
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'recent'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🕐 Last 30 Days
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📚 All Stories
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Partnership Applications */}
            {partnerships.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-hti-navy mb-6">
                  Partnership Applications ({partnerships.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnerships.map(partnership => (
                    <div
                      key={partnership.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedStory(partnership)}
                    >
                      {/* Status Badge */}
                      <div className={`px-4 py-2 text-sm font-semibold ${
                        partnership.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : partnership.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {partnership.status}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-hti-navy mb-2">
                          {partnership.organizationName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {partnership.contactPerson} • {partnership.county} County
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Chromebooks Needed:</span>
                            <span className="text-hti-navy font-bold">{partnership.chromebooksNeeded}</span>
                          </div>
                          {partnership.is501c3 && (
                            <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              501(c)(3)
                            </div>
                          )}
                        </div>

                        {partnership.quote && (
                          <div className="mt-4 p-3 bg-pink-50 rounded-lg border-l-4 border-pink-600">
                            <p className="text-sm text-gray-700 italic line-clamp-3">
                              "{partnership.quote.substring(0, 150)}..."
                            </p>
                          </div>
                        )}

                        <button className="mt-4 w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors">
                          View Full Application
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Individual Recipients */}
            {recipients.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-hti-navy mb-6">
                  Individual Recipients ({recipients.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recipients.map(recipient => (
                    <div
                      key={recipient.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedStory(recipient)}
                    >
                      <div className={`h-2 ${
                        recipient.status === 'Approved' ? 'bg-green-500' :
                        recipient.status === 'Pending' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />

                      <div className="p-6">
                        <h3 className="text-lg font-bold text-hti-navy mb-1">
                          {recipient.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {recipient.occupation} • {recipient.county}
                        </p>

                        {recipient.quote && (
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-700 italic line-clamp-4">
                              "{recipient.quote.substring(0, 120)}..."
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-medium transition-colors">
                            Generate Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Modal for full details */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-hti-navy">
                  {selectedStory.organizationName || selectedStory.name}
                </h2>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Full application details */}
              <div className="space-y-4 text-sm">
                {selectedStory.contactPerson && (
                  <div>
                    <span className="font-semibold">Contact:</span> {selectedStory.contactPerson}
                  </div>
                )}
                {selectedStory.email && (
                  <div>
                    <span className="font-semibold">Email:</span> {selectedStory.email}
                  </div>
                )}
                {selectedStory.howWillUse && (
                  <div>
                    <span className="font-semibold block mb-2">How they'll use Chromebooks:</span>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedStory.howWillUse}</p>
                  </div>
                )}
                {selectedStory.positiveImpact && (
                  <div>
                    <span className="font-semibold block mb-2">Expected positive impact:</span>
                    <p className="text-gray-700 bg-pink-50 p-4 rounded-lg">{selectedStory.positiveImpact}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-hti-navy to-hti-teal text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Generate Social Quote Card
                </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
