"use client";

import { Save, Folder, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FilterPreset {
    id: string;
    name: string;
    filters: Record<string, any>;
    createdAt: Date;
}

interface FilterPresetsProps {
    currentFilters: Record<string, any>;
    onLoadPreset: (filters: Record<string, any>) => void;
    storageKey?: string;
}

export function FilterPresets({ currentFilters, onLoadPreset, storageKey = "filter-presets" }: FilterPresetsProps) {
    const [presets, setPresets] = useState<FilterPreset[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [presetName, setPresetName] = useState("");

    useEffect(() => {
        // Load presets from localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPresets(parsed.map((p: any) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                })));
            } catch (e) {
                console.error("Failed to load presets:", e);
            }
        }
    }, [storageKey]);

    const savePreset = () => {
        if (!presetName.trim()) return;

        const newPreset: FilterPreset = {
            id: Date.now().toString(),
            name: presetName.trim(),
            filters: currentFilters,
            createdAt: new Date(),
        };

        const updated = [...presets, newPreset];
        setPresets(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setPresetName("");
        setShowSaveDialog(false);
    };

    const deletePreset = (id: string) => {
        const updated = presets.filter(p => p.id !== id);
        setPresets(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const loadPreset = (preset: FilterPreset) => {
        onLoadPreset(preset.filters);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-muted" />
                    <span className="text-sm font-semibold text-secondary">Saved Filters</span>
                </div>
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-accent hover:bg-soft-accent rounded transition-colors"
                >
                    <Save className="w-3 h-3" />
                    Save Current
                </button>
            </div>

            {presets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <div
                            key={preset.id}
                            className="group relative flex items-center gap-2 px-3 py-1.5 bg-surface-alt border border-default rounded-lg hover:border-accent transition-all cursor-pointer"
                            onClick={() => loadPreset(preset)}
                        >
                            <span className="text-xs font-medium text-primary">{preset.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePreset(preset.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-danger/20 rounded transition-all"
                            >
                                <X className="w-3 h-3 text-danger" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showSaveDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-xl border-2 border-default shadow-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-primary mb-4">Save Filter Preset</h3>
                        <input
                            type="text"
                            placeholder="Preset name..."
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") savePreset();
                                if (e.key === "Escape") setShowSaveDialog(false);
                            }}
                            className="w-full px-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus:border-accent text-primary placeholder:text-muted mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setPresetName("");
                                }}
                                className="px-4 py-2 bg-surface-alt border border-default rounded-lg hover:bg-surface transition-colors text-primary font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePreset}
                                disabled={!presetName.trim()}
                                className="px-4 py-2 accent-gradient text-on-accent rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

