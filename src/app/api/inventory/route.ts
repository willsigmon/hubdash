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

const inventoryItemSchema = z.object({
  category: z.enum(["equipment", "parts"]),
  type: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(0),
  minThreshold: z.number().int().min(0),
  location: z.string().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/inventory
 * Get all inventory items
 */
export async function GET() {
  try {
    return NextResponse.json(inventoryStore, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      }
    });
  } catch (error: any) {
    console.error('GET /api/inventory error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}

/**
 * POST /api/inventory
 * Create a new inventory item
 * Note: Auth disabled for development - enable in production
 */
export async function POST(request: NextRequest) {
  try {
    // requireAuth(request); // Enable in production

    const body = await request.json();
    const validated = inventoryItemSchema.parse(body);

    const newItem = {
      id: Date.now().toString(),
      ...validated,
      lastUpdated: new Date().toISOString(),
    };

    inventoryStore.push(newItem);

    return NextResponse.json({ data: newItem, id: newItem.id }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json({ error: error.message, success: false }, { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request data: ' + error.message, success: false }, { status: 400 });
    }
    console.error('POST /api/inventory error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create inventory item', success: false }, { status: 500 });
  }
}
