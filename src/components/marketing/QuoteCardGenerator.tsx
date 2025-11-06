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
    name: "HTI Plum",
    bg: "linear-gradient(135deg, #2F2D4C 0%, #C05F37 100%)",
    textColor: "#EEE6DF",
    accentColor: "#E2A835",
  },
  {
    name: "Sunrise Ember",
    bg: "linear-gradient(135deg, #C05F37 0%, #E2A835 100%)",
    textColor: "#2F2D4C",
    accentColor: "#0F0C11",
  },
  {
    name: "Midnight Impact",
    bg: "linear-gradient(135deg, #0F0C11 0%, #433D58 100%)",
    textColor: "#EEE6DF",
    accentColor: "#C05F37",
  },
  {
    name: "Minimal Sand",
    bg: "#FFFFFF",
    textColor: "#2F2D4C",
    accentColor: "#C05F37",
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
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-hti-fig/12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-hti-fig/12 bg-hti-sand/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-hti-plum">Generate Quote Card</h2>
              <p className="text-sm text-hti-stone mt-1">
                Create shareable social media graphics from impact stories
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-hti-mist hover:text-hti-plum text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div>
            <h3 className="text-lg font-semibold text-hti-plum mb-4">Preview</h3>
            <div className="aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-hti-fig/12">
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
            <p className="text-xs text-hti-mist mt-3 text-center">
              Final card will be 1080×1080px (Instagram optimal)
            </p>
          </div>

          {/* Right: Controls */}
          <div>
            <h3 className="text-lg font-semibold text-hti-plum mb-4">Customization</h3>

            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-hti-stone mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Choose Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme, index) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(index)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedTheme === index
                        ? "border-hti-ember shadow-lg scale-105 bg-hti-sand/50"
                        : "border-hti-fig/12 hover:border-hti-fig/18 bg-white"
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-md mb-2"
                      style={{ background: theme.bg }}
                    />
                    <p className="text-sm font-medium text-hti-stone">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Text (editable) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-hti-stone mb-2">
                Quote Text
              </label>
              <textarea
                defaultValue={quote}
                rows={4}
                className="w-full px-3 py-2 border border-hti-fig/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-ember text-sm"
                placeholder="Edit the quote text..."
              />
              <p className="text-xs text-hti-mist mt-1">
                Keep it under 180 characters for best readability
              </p>
            </div>

            {/* Author Details (editable) */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-hti-stone mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  defaultValue={authorName}
                  className="w-full px-3 py-2 border border-hti-fig/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-ember text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-hti-stone mb-2">
                  Title/Role (optional)
                </label>
                <input
                  type="text"
                  defaultValue={authorTitle}
                  placeholder="e.g., Chromebook Recipient, Partner Organization"
                  className="w-full px-3 py-2 border border-hti-fig/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-ember text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-hti-plum to-hti-ember text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-hti-sand/70 hover:bg-hti-sand text-hti-plum rounded-xl font-semibold border border-hti-fig/12 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-hti-ember" />
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
                className="w-full px-6 py-3 bg-white hover:bg-hti-sand/70 text-hti-stone rounded-xl font-semibold transition-colors border border-hti-fig/15"
              >
                Close
              </button>
            </div>

            {/* Usage Tips */}
            <div className="mt-6 p-4 bg-hti-soleil/15 rounded-xl border border-hti-gold/30">
              <h4 className="font-semibold text-hti-plum text-sm mb-2">💡 Usage Tips</h4>
              <ul className="text-xs text-hti-plum space-y-1">
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
