"use client";

import { queryKeys } from "@/lib/query-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Battery,
  Cable,
  ChevronDown,
  ChevronUp,
  Cpu,
  Edit2,
  HardDrive,
  Monitor,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  Wifi
} from "lucide-react";
import { useState } from "react";
import { X } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import GradientHeading from "../ui/GradientHeading";

interface InventoryItem {
  id: string;
  category: "equipment" | "parts";
  type: string;
  name: string;
  quantity: number;
  minThreshold: number;
  location?: string;
  condition: string;
  notes?: string;
  lastUpdated: string;
}

const EQUIPMENT_TYPES = [
  { value: "Monitor", icon: Monitor, color: "text-accent" },
  { value: "Hard Drive", icon: HardDrive, color: "text-warning" },
  { value: "Keyboard", icon: Cable, color: "text-accent" },
  { value: "Mouse", icon: Cable, color: "text-accent" },
];

const PARTS_TYPES = [
  { value: "Battery", icon: Battery, color: "text-success" },
  { value: "Charger", icon: Cable, color: "text-warning" },
  { value: "RAM", icon: Cpu, color: "text-accent" },
  { value: "WiFi Card", icon: Wifi, color: "text-accent" },
];

interface InventoryModalProps {
  item?: InventoryItem;
  onClose: () => void;
  onSubmit: (data: Partial<InventoryItem>) => void;
  isLoading: boolean;
}

function InventoryModal({ item, onClose, onSubmit, isLoading }: InventoryModalProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    category: item?.category || "equipment",
    type: item?.type || "",
    name: item?.name || "",
    quantity: item?.quantity || 0,
    minThreshold: item?.minThreshold || 0,
    location: item?.location || "",
    condition: item?.condition || "Good",
    notes: item?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableTypes = formData.category === "equipment" ? EQUIPMENT_TYPES : PARTS_TYPES;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full border border-default max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-default p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-primary">
            {item ? "Edit Inventory Item" : "Add Inventory Item"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Category *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: "equipment", type: "" })}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.category === "equipment"
                    ? "accent-gradient text-on-accent"
                    : "bg-surface-alt text-secondary hover:bg-surface"
                }`}
              >
                Equipment
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: "parts", type: "" })}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.category === "parts"
                    ? "accent-gradient text-on-accent"
                    : "bg-surface-alt text-secondary hover:bg-surface"
                }`}
              >
                Parts
              </button>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
              required
            >
              <option value="">Select type...</option>
              {availableTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
              placeholder='e.g., Dell 24" LCD Monitor'
              required
            />
          </div>

          {/* Quantity & Min Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Min Threshold *
              </label>
              <input
                type="number"
                min="0"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
              placeholder="e.g., Warehouse A"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-default">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-surface-alt text-secondary rounded-lg font-semibold hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 accent-gradient text-on-accent rounded-lg font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EquipmentInventory() {
  const [activeTab, setActiveTab] = useState<"equipment" | "parts">("equipment");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "quantity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const { data: inventoryData, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const inventory: InventoryItem[] = inventoryData || [];

  const createMutation = useMutation({
    mutationFn: async (newItem: Partial<InventoryItem>) => {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InventoryItem> }) => {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const filteredItems = inventory
    .filter((item) => item.category === activeTab)
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return multiplier * a.name.localeCompare(b.name);
      }
      return multiplier * (a.quantity - b.quantity);
    });

  const lowStockItems = filteredItems.filter((item) => item.quantity < item.minThreshold);
  const totalValue = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GradientHeading variant="navy" className="text-xl">
          Equipment Inventory Overview
        </GradientHeading>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 accent-gradient text-on-accent rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-default bg-surface p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary mb-1">{totalValue}</div>
          <div className="text-[10px] text-secondary uppercase tracking-wide">Total Items</div>
        </div>
        <div className="rounded-xl border border-default bg-surface p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-success mb-1">
            {filteredItems.filter(i => i.quantity >= i.minThreshold).length}
          </div>
          <div className="text-[10px] text-secondary uppercase tracking-wide">In Stock</div>
        </div>
        <div className="rounded-xl border border-default bg-surface p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-warning mb-1">{lowStockItems.length}</div>
          <div className="text-[10px] text-secondary uppercase tracking-wide">Low Stock</div>
        </div>
        <div className="rounded-xl border border-default bg-surface p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-danger mb-1">
            {filteredItems.filter(i => i.quantity === 0).length}
          </div>
          <div className="text-[10px] text-secondary uppercase tracking-wide">Out of Stock</div>
        </div>
      </div>

          {/* Low Stock Alert - Improved Clarity */}
          {lowStockItems.length > 0 && (
            <div className="rounded-xl border-2 border-warning/50 bg-gradient-to-br from-soft-warning/80 to-soft-warning/40 p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center border-2 border-warning/50">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-warning mb-1 text-base">Low Stock Alert</h4>
                  <p className="text-sm text-primary mb-3 font-medium">
                    {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} need{lowStockItems.length === 1 ? "s" : ""} restocking
                  </p>
                  <p className="text-xs text-secondary mb-4">
                    These items are below their minimum threshold and may run out soon. Click any item to update quantity.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lowStockItems.slice(0, 6).map((item) => {
                      const stockPercent = Math.round((item.quantity / item.minThreshold) * 100);
                      return (
                        <button
                          key={item.id}
                          onClick={() => setEditingId(item.id)}
                          className="group text-left px-3 py-2.5 bg-surface rounded-lg border border-default hover:border-warning hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-primary group-hover:text-warning transition-colors truncate">
                              {item.name}
                            </span>
                            <span className="text-xs font-bold text-warning ml-2 flex-shrink-0">
                              {item.quantity}/{item.minThreshold}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warning transition-all"
                              style={{ width: `${Math.min(stockPercent, 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-muted mt-1">
                            {stockPercent}% of minimum
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {lowStockItems.length > 6 && (
                    <p className="text-xs text-muted mt-3 text-center">
                      +{lowStockItems.length - 6} more item{lowStockItems.length - 6 !== 1 ? "s" : ""} below threshold
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs & Search */}
          <div className="rounded-xl border border-default bg-surface p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("equipment")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "equipment"
                      ? "accent-gradient text-on-accent"
                      : "bg-surface-alt text-secondary hover:bg-surface"
                    }`}
                >
                  Equipment
                </button>
                <button
                  onClick={() => setActiveTab("parts")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "parts"
                      ? "accent-gradient text-on-accent"
                      : "bg-surface-alt text-secondary hover:bg-surface"
                    }`}
                >
                  Parts
                </button>
              </div>

              {/* Search & Sort */}
              <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-sm text-primary placeholder:text-muted"
                  />
                </div>
                <button
                  onClick={() => {
                    if (sortBy === "quantity") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("quantity");
                      setSortOrder("desc");
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-surface-alt hover:bg-surface rounded-lg text-xs font-medium text-primary transition-colors"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  {sortBy === "quantity" ? (sortOrder === "desc" ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />) : "Sort"}
                </button>
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <GlassCard key={i}>
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-surface-alt rounded w-3/4" />
                  <div className="h-4 bg-surface-alt rounded w-1/2" />
                  <div className="h-8 bg-surface-alt rounded" />
                </div>
              </GlassCard>
            ))}
          </>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-secondary text-lg">No items found</div>
          </div>
        ) : (
          filteredItems.map((item) => {
            const typeConfig = [...EQUIPMENT_TYPES, ...PARTS_TYPES].find(t => t.value === item.type);
            const Icon = typeConfig?.icon || HardDrive;
            const isLowStock = item.quantity < item.minThreshold;
            const stockPercent = Math.min((item.quantity / item.minThreshold) * 100, 100);

            return (
              <div
                key={item.id}
                className={`rounded-xl border border-default bg-surface p-4 shadow-lg hover:shadow-xl transition-all ${isLowStock ? "border-highlight" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg accent-gradient`}>
                      <Icon className="w-4 h-4 text-on-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-primary">{item.name}</h4>
                      <p className="text-[10px] text-secondary">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="p-1 hover:bg-surface-alt rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-muted" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${item.name}?`)) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-1 hover:bg-soft-danger rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-danger" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Quantity */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-secondary uppercase tracking-wide">Quantity</span>
                      <span className={`text-xl font-bold ${item.quantity === 0 ? "text-danger" : isLowStock ? "text-warning" : "text-success"
                        }`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${item.quantity === 0 ? "bg-danger" : isLowStock ? "bg-warning" : "bg-success"
                          }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">
                      Min: {item.minThreshold}
                    </div>
                  </div>

                  {/* Details */}
                  {item.location && (
                    <div className="text-[10px] text-secondary">
                      <span className="font-semibold text-primary">Location:</span> {item.location}
                    </div>
                  )}
                  <div className="text-[10px] text-secondary">
                    <span className="font-semibold text-primary">Condition:</span>{" "}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] ${item.condition === "New" ? "bg-soft-success text-success border border-success" : "bg-soft-accent text-accent border border-accent"
                      }`}>
                      {item.condition}
                    </span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-muted italic">
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingId) && (
        <InventoryModal
          item={editingId ? inventory.find(i => i.id === editingId) : undefined}
          onClose={() => {
            setShowCreateModal(false);
            setEditingId(null);
          }}
          onSubmit={(data) => {
            if (editingId) {
              updateMutation.mutate({ id: editingId, updates: data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
