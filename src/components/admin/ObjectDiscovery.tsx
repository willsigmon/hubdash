"use client";

import { useState } from "react";

interface KnackField {
  key: string;
  name: string;
  type: string;
}

interface DiscoveredObject {
  key: string;
  name: string;
  fieldCount: number;
  fields: KnackField[];
}

interface DiscoveryResponse {
  success: boolean;
  objectCount: number;
  objects: DiscoveredObject[];
  timestamp: string;
}

export function ObjectDiscovery() {
  const [discovering, setDiscovering] = useState(false);
  const [objects, setObjects] = useState<DiscoveredObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedObject, setExpandedObject] = useState<string | null>(null);

  const handleDiscover = async () => {
    setDiscovering(true);
    setError(null);
    setObjects([]);

    try {
      const response = await fetch('/api/knack/discover');
      const data: DiscoveryResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.success === false ? 'Discovery failed' : 'Unknown error');
      }

      setObjects(data.objects);
      // Save discovery timestamp to localStorage for health indicator
      localStorage.setItem('lastDiscoveryTime', new Date().toISOString());
    } catch (err: any) {
      setError(err.message || 'Failed to discover Knack objects');
      console.error('Discovery error:', err);
    } finally {
      setDiscovering(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleDiscover}
          disabled={discovering}
          className="px-6 py-3 bg-hti-teal hover:bg-hti-teal-light disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {discovering ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Discovering...
            </>
          ) : (
            <>
              🔍 Discover Knack Objects
            </>
          )}
        </button>
        {objects.length > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {objects.length} object{objects.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-900">Discovery Failed</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Make sure KNACK_APP_ID and KNACK_API_KEY are configured in your environment.
              </p>
            </div>
          </div>
        </div>
      )}

      {objects.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Discovered Objects</h3>
          <div className="space-y-2">
            {objects.map((obj) => (
              <div
                key={obj.key}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => setExpandedObject(expandedObject === obj.key ? null : obj.key)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">📋</span>
                    <div className="text-left">
                      <h4 className="font-semibold text-hti-navy">{obj.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{obj.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-hti-teal/10 text-hti-teal px-3 py-1 rounded-full font-medium">
                      {obj.fieldCount} fields
                    </span>
                    <span className={`transform transition-transform ${expandedObject === obj.key ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedObject === obj.key && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2">
                      {obj.fields.map((field) => (
                        <div key={field.key} className="flex items-start gap-3 bg-white p-3 rounded border border-gray-100">
                          <span className="text-sm text-gray-500 font-mono min-w-[80px] font-bold text-hti-navy">
                            {field.type}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{field.name}</p>
                            <p className="text-xs text-gray-500 font-mono mt-1">{field.key}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Next Steps</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Review the discovered objects and their field mappings</li>
              <li>Update field mappings in <code className="bg-blue-100 px-1 rounded">/lib/knack/discovery.ts</code></li>
              <li>Test sync to ensure proper data transformation</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
