import { requireAuth } from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Shared in-memory store (in production, this would be a database)
// Note: This is a simple implementation - in production, use a proper database
declare global {
  var inventoryStore: any[] | undefined;
}

if (!global.inventoryStore) {
  global.inventoryStore = [
    {
      id: "1",
      category: "equipment",
      type: "Monitor",
      name: "Dell 24\" LCD Monitor",
      quantity: 45,
      minThreshold: 20,
      location: "Warehouse A",
      condition: "Good",
      lastUpdated: new Date().toISOString(),
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
      lastUpdated: new Date().toISOString(),
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
      lastUpdated: new Date().toISOString(),
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
      lastUpdated: new Date().toISOString(),
    },
  ];
}

const inventoryStore = global.inventoryStore;

const updateInventoryItemSchema = z.object({
  category: z.enum(["equipment", "parts"]).optional(),
  type: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  quantity: z.number().int().min(0).optional(),
  minThreshold: z.number().int().min(0).optional(),
  location: z.string().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * PATCH /api/inventory/[id]
 * Update an inventory item
 * Note: Auth disabled for development - enable in production
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // requireAuth(request); // Enable in production

    const { id } = await params;
    const body = await request.json();
    const validated = updateInventoryItemSchema.parse(body);

    const index = inventoryStore.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found', success: false }, { status: 404 });
    }

    inventoryStore[index] = {
      ...inventoryStore[index],
      ...validated,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ data: inventoryStore[index], id, success: true });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json({ error: error.message, success: false }, { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request data: ' + error.message, success: false }, { status: 400 });
    }
    console.error('PATCH /api/inventory/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update inventory item', success: false }, { status: 500 });
  }
}

/**
 * DELETE /api/inventory/[id]
 * Delete an inventory item
 * Note: Auth disabled for development - enable in production
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // requireAuth(request); // Enable in production

    const { id } = await params;
    const index = inventoryStore.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found', success: false }, { status: 404 });
    }

    inventoryStore.splice(index, 1);

    return NextResponse.json({ data: { deleted: true }, id, success: true });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json({ error: error.message, success: false }, { status: 401 });
    }
    console.error('DELETE /api/inventory/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete inventory item', success: false }, { status: 500 });
  }
}

