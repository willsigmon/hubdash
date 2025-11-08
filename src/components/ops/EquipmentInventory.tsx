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

export default function EquipmentInventory() {
  const [activeTab, setActiveTab] = useState<"equipment" | "parts">("equipment");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "quantity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: queryKeys.devices, // TODO: Create queryKeys.inventory
    queryFn: async () => {
      // In production: GET /api/inventory
      // Mock data for now
      return [
        {
          id: "1",
          category: "equipment",
          type: "Monitor",
          name: "Dell 24\" LCD Monitor",
          quantity: 45,
          minThreshold: 20,
          location: "Warehouse A",
          condition: "Good",
          lastUpdated: "2024-01-15",
        },
        {
          id: "2",
          category: "equipment",
          type: "Hard Drive",
          name: "500GB HDD",
          quantity: 12,
          minThreshold: 15,
          location: "Storage Room",
          condition: "Good",
          notes: "Low stock - order more",
          lastUpdated: "2024-01-14",
        },
        {
          id: "3",
          category: "parts",
          type: "Battery",
          name: "Laptop Battery - Generic",
          quantity: 8,
          minThreshold: 10,
          location: "Parts Bin 3",
          condition: "New",
          notes: "Urgent reorder needed",
          lastUpdated: "2024-01-13",
        },
        {
          id: "4",
          category: "parts",
          type: "RAM",
          name: "8GB DDR4 RAM",
          quantity: 67,
          minThreshold: 25,
          location: "Parts Bin 1",
          condition: "Good",
          lastUpdated: "2024-01-16",
        },
      ];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: Partial<InventoryItem>) => {
      // In production: POST /api/inventory
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InventoryItem> }) => {
      // In production: PATCH /api/inventory/:id
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In production: DELETE /api/inventory/:id
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_WRITE_API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    },
  });

  const filteredItems = (inventory || [])
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <GradientHeading variant="plum">
          Equipment & Parts Inventory
        </GradientHeading>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 accent-gradient text-white rounded-lg font-semibold hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{totalValue}</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Total Items</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">
              {filteredItems.filter(i => i.quantity >= i.minThreshold).length}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wider">In Stock</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-1">{lowStockItems.length}</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Low Stock</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-danger mb-1">
              {filteredItems.filter(i => i.quantity === 0).length}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wider">Out of Stock</div>
          </div>
        </GlassCard>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <GlassCard className="border-2 border-warning/30 bg-soft-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-warning mb-1">Low Stock Alert</h4>
              <p className="text-sm text-secondary mb-2">
                {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} below minimum threshold
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-3 py-1 bg-surface-alt rounded-full text-xs font-medium text-accent border border-default"
                  >
                    {item.name} ({item.quantity}/{item.minThreshold})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Tabs & Search */}
      <GlassCard>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("equipment")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "equipment"
                  ? "accent-gradient text-white"
                  : "bg-surface-alt text-secondary hover:bg-surface"
              }`}
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab("parts")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "parts"
                  ? "accent-gradient text-white"
                  : "bg-surface-alt text-secondary hover:bg-surface"
              }`}
            >
              Parts
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-default rounded-lg focus:outline-none focus-ring text-primary placeholder:text-muted"
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
              className="flex items-center gap-2 px-4 py-3 bg-surface-alt hover:bg-surface rounded-lg text-sm font-medium text-primary transition-colors"
            >
              <TrendingDown className="w-4 h-4" />
              {sortBy === "quantity" ? (sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />) : "Sort"}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <GlassCard key={i}>
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-white/20 rounded w-3/4" />
                  <div className="h-4 bg-white/20 rounded w-1/2" />
                  <div className="h-8 bg-white/20 rounded" />
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
              <GlassCard
                key={item.id}
                className={`${isLowStock ? "border-2 border-warning/30" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${activeTab === "equipment" ? "accent-gradient" : "accent-gradient"}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{item.name}</h4>
                      <p className="text-xs text-secondary">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="p-1.5 hover:bg-surface-alt rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${item.name}?`)) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-1.5 hover:bg-soft-danger rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Quantity */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-secondary">Quantity</span>
                      <span className={`text-2xl font-bold ${
                        item.quantity === 0 ? "text-danger" : isLowStock ? "text-warning" : "text-success"
                      }`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.quantity === 0 ? "bg-danger" : isLowStock ? "bg-warning" : "bg-success"
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Min: {item.minThreshold}
                    </div>
                  </div>

                  {/* Details */}
                  {item.location && (
                    <div className="text-xs text-secondary">
                      <span className="font-semibold text-primary">Location:</span> {item.location}
                    </div>
                  )}
                  <div className="text-xs text-secondary">
                    <span className="font-semibold text-primary">Condition:</span>{" "}
                    <span className={`inline-flex px-2 py-0.5 rounded ${
                      item.condition === "New" ? "bg-soft-success text-success border border-success/30" : "bg-soft-accent text-accent border border-accent/30"
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                  {item.notes && (
                    <div className="text-xs text-muted italic">
                      {item.notes}
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal - simplified for now */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-default">
            <h3 className="text-2xl font-bold text-primary mb-4">Add Inventory Item</h3>
            <p className="text-secondary text-sm mb-4">
              Create form coming soon - full CRUD implementation
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 bg-soft-accent text-accent rounded-lg font-semibold hover:bg-soft-accent/70 transition-colors border border-accent/30"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
