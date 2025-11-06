"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check, RefreshCw, Palette } from "lucide-react";

interface QuoteCardGeneratorProps {
  quote: string;
  authorName: string;
  authorTitle?: string;
  county?: string;
  onClose: () => void;
}

const themes = [
  {
    name: "HTI Navy",
    bg: "linear-gradient(135deg, #1e3a5f 0%, #4a9b9f 100%)",
    textColor: "#ffffff",
    accentColor: "#ffeb3b",
  },
  {
    name: "Warm Sunset",
    bg: "linear-gradient(135deg, #ff6b6b 0%, #ffeb3b 100%)",
    textColor: "#1e3a5f",
    accentColor: "#ffffff",
  },
  {
    name: "Teal Fresh",
    bg: "linear-gradient(135deg, #4a9b9f 0%, #6db3b7 100%)",
    textColor: "#ffffff",
    accentColor: "#1e3a5f",
  },
  {
    name: "Professional",
    bg: "#ffffff",
    textColor: "#1e3a5f",
    accentColor: "#4a9b9f",
  },
];

export default function QuoteCardGenerator({
  quote,
  authorName,
  authorTitle,
  county,
  onClose,
}: QuoteCardGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTheme = themes[selectedTheme];

  const handleDownload = async () => {
    setDownloading(true);

    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implement actual canvas-to-image conversion
    alert("Quote card download would start here. This will generate a 1080x1080 PNG optimized for social media.");

    setDownloading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-hti-navy">Generate Quote Card</h2>
              <p className="text-sm text-gray-600 mt-1">
                Create shareable social media graphics from impact stories
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div>
            <h3 className="text-lg font-semibold text-hti-navy mb-4">Preview</h3>
            <div className="aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-gray-200">
              <div
                style={{
                  background: currentTheme.bg,
                  color: currentTheme.textColor,
                }}
                className="w-full h-full flex flex-col justify-between p-8"
              >
                {/* Quote */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      style={{ color: currentTheme.accentColor }}
                      className="text-6xl font-serif mb-4"
                    >
                      "
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed">
                      {quote.substring(0, 180)}{quote.length > 180 ? "..." : ""}
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="border-t pt-4" style={{ borderColor: `${currentTheme.accentColor}40` }}>
                  <p className="font-bold text-lg">{authorName}</p>
                  {authorTitle && (
                    <p className="text-sm opacity-100 mt-1">{authorTitle}</p>
                  )}
                  {county && (
                    <p className="text-sm opacity-100 mt-1">{county} County, NC</p>
                  )}
                </div>

                {/* HTI Branding */}
                <div className="text-center mt-6">
                  <div className="font-bold text-lg mb-1">HUBZone Technology Initiative</div>
                  <div className="text-sm opacity-100">Expanding Digital Opportunity</div>
                </div>
              </div>
            </div>

            {/* Download hint */}
            <p className="text-xs text-gray-500 mt-3 text-center">
              Final card will be 1080×1080px (Instagram optimal)
            </p>
          </div>

          {/* Right: Controls */}
          <div>
            <h3 className="text-lg font-semibold text-hti-navy mb-4">Customization</h3>

            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Choose Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme, index) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(index)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTheme === index
                        ? "border-hti-teal shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-md mb-2"
                      style={{ background: theme.bg }}
                    />
                    <p className="text-sm font-medium text-gray-700">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Text (editable) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Text
              </label>
              <textarea
                defaultValue={quote}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
                placeholder="Edit the quote text..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep it under 180 characters for best readability
              </p>
            </div>

            {/* Author Details (editable) */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  defaultValue={authorName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title/Role (optional)
                </label>
                <input
                  type="text"
                  defaultValue={authorTitle}
                  placeholder="e.g., Chromebook Recipient, Partner Organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-hti-navy to-hti-teal text-white rounded-lg font-semibold hover:opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Quote Card
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Quote Text
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors border border-gray-300"
              >
                Close
              </button>
            </div>

            {/* Usage Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Usage Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use for Instagram, Facebook, and LinkedIn posts</li>
                <li>• Keep quotes authentic and impactful</li>
                <li>• Get permission before sharing personal stories</li>
                <li>• Tag HTI when posting (@hubzonetech)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
