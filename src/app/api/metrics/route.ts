import { NextResponse } from "next/server";
import { getCachedOrStale } from "@/lib/knack/persistent-cache";

type KnackRecord = Record<string, unknown> & { id: string };

interface KnackListResponse {
  records: KnackRecord[];
  total_records?: number;
  total_pages?: number;
  current_page?: number;
}

const KNACK_BASE_URL = process.env.KNACK_BASE_URL || "https://api.knack.com/v1";
const DEVICES_OBJECT = process.env.KNACK_DEVICES_OBJECT || "object_7";
const ORGANISATIONS_OBJECT = process.env.KNACK_ORGANIZATIONS_OBJECT || "object_22";

function ensureKnackCredentials() {
  const appId = process.env.KNACK_APP_ID;
  const apiKey = process.env.KNACK_API_KEY;

  if (!appId || !apiKey) {
    throw new Error("Knack credentials missing. Add KNACK_APP_ID and KNACK_API_KEY to .env.local");
  }

  return {
    appId,
    apiKey,
  };
}

async function fetchKnackPage(
  objectKey: string,
  {
    page = 1,
    rowsPerPage = 500,
    filters,
  }: {
    page?: number;
    rowsPerPage?: number;
    filters?: unknown;
  } = {}
): Promise<KnackListResponse> {
  const { appId, apiKey } = ensureKnackCredentials();

  const params = new URLSearchParams();
  params.set("rows_per_page", String(rowsPerPage));
  params.set("page", String(page));
  if (filters) {
    params.set("filters", JSON.stringify(filters));
  }

  const response = await fetch(`${KNACK_BASE_URL}/objects/${objectKey}/records?${params.toString()}`, {
    headers: {
      "X-Knack-Application-Id": appId,
      "X-Knack-REST-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Knack request failed (${response.status}): ${body}`);
  }

  return (await response.json()) as KnackListResponse;
}

async function fetchKnackCount(objectKey: string, filters?: unknown): Promise<number> {
  const page = await fetchKnackPage(objectKey, { filters, rowsPerPage: 1 });
  return page.total_records ?? page.records?.length ?? 0;
}

async function fetchAllRecords(objectKey: string, filters?: unknown): Promise<{ records: KnackRecord[]; totalRecords: number }> {
  const firstPage = await fetchKnackPage(objectKey, { filters, page: 1 });
  const totalRecords = firstPage.total_records ?? firstPage.records.length;
  const totalPages = firstPage.total_pages ?? 1;

  if (totalPages === 1) {
    return { records: firstPage.records ?? [], totalRecords };
  }

  const records = [...(firstPage.records ?? [])];
  for (let page = 2; page <= totalPages; page += 1) {
    const next = await fetchKnackPage(objectKey, { filters, page });
    if (Array.isArray(next.records)) {
      records.push(...next.records);
    }
  }

  return { records, totalRecords };
}

function normaliseStatus(entry: KnackRecord, fallback = "Unknown"): string {
  const raw = entry.field_56_raw ?? entry.field_56 ?? fallback;

  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0] as Record<string, unknown>;
    return String(first?.identifier || first?.id || first?.name || fallback);
  }

  if (typeof raw === "object" && raw !== null) {
    const candidate = (raw as Record<string, unknown>).identifier || (raw as Record<string, unknown>).id;
    if (candidate) return String(candidate);
  }

  return String(raw ?? fallback);
}

const GRANT_FILTER = [
  { field: "field_458", operator: "is", value: "Laptop" },
  { field: "field_56", operator: "is", value: "Completed-Presented" },
  { field: "field_75", operator: "is after", value: "2024-09-08" },
];

const LAPTOP_FILTER = [{ field: "field_458", operator: "is", value: "Laptop" }];

export async function GET() {
  try {
    // Check if Knack is configured
    const appId = process.env.KNACK_APP_ID;
    const apiKey = process.env.KNACK_API_KEY;

    if (!appId || !apiKey) {
      console.error('❌ Knack API credentials not configured for metrics endpoint')
      console.error('   Add KNACK_APP_ID and KNACK_API_KEY to .env.local')
      return NextResponse.json(
        {
          error: 'Knack integration not configured. Please add credentials to .env.local',
          setup_guide: 'Run: npm run setup-knack'
        },
        { status: 503 }
      )
    }

    console.log('📊 Fetching metrics from Knack...')

    // Use persistent cache with 1 hour TTL to minimize API calls
    const metrics = await getCachedOrStale(
      'api:metrics:v2',
      async () => {
        const grantLaptopsPresented = await fetchKnackCount(DEVICES_OBJECT, GRANT_FILTER);

        const [{ records: laptopRecords, totalRecords: totalDevices }, { records: organisations, totalRecords: organisationsTotal }]
          = await Promise.all([
            fetchAllRecords(DEVICES_OBJECT, LAPTOP_FILTER),
            fetchAllRecords(ORGANISATIONS_OBJECT),
          ]);

        return { grantLaptopsPresented, laptopRecords, totalDevices, organisations, organisationsTotal };
      },
      3600 // 1 hour TTL
    );

    const { grantLaptopsPresented, laptopRecords, totalDevices, organisations, organisationsTotal } = metrics;

    const distributedCount = laptopRecords.reduce((acc, record) => {
      const status = normaliseStatus(record).toLowerCase();
      return acc + (status.includes("completed") || status.includes("presented") ? 1 : 0);
    }, 0);

    const pipelineCounts = laptopRecords.reduce<Record<string, number>>((acc, record) => {
      const status = normaliseStatus(record);
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {});

    const counties = new Set<string>();
    organisations.forEach((organisation) => {
      const countyRaw = organisation.field_613_raw ?? organisation.field_613;
      if (Array.isArray(countyRaw) && countyRaw.length > 0) {
        const first = countyRaw[0] as Record<string, unknown>;
        const identifier = first?.identifier || first?.id || first?.name;
        if (identifier) counties.add(String(identifier));
      } else if (countyRaw) {
        counties.add(String(countyRaw));
      }
    });

    const readyCount = pipelineCounts["Ready"] || pipelineCounts["Ready to Ship"] || pipelineCounts["Ready-to-Ship"] || 0;

    const grantLaptopGoal = Number(process.env.GRANT_LAPTOP_GOAL || 1500);

    const result = {
      grantLaptopsPresented,
      grantLaptopGoal,
      grantLaptopProgress: Math.round((grantLaptopsPresented / Math.max(grantLaptopGoal, 1)) * 100),
      grantTrainingHoursGoal: Number(process.env.GRANT_TRAINING_HOURS_GOAL || 125),
      totalLaptopsCollected: totalDevices,
      totalChromebooksDistributed: distributedCount,
      countiesServed: counties.size,
      peopleTrained: Number(process.env.METRICS_PEOPLE_TRAINED || 0),
      eWasteTons: Number(((totalDevices * 5) / 2000).toFixed(1)),
      partnerOrganizations: organisationsTotal,
      pipeline: {
        donated: pipelineCounts["Donated"] || 0,
        received: pipelineCounts["Received"] || 0,
        dataWipe: pipelineCounts["Data Wipe"] || pipelineCounts["Data-Wipe"] || 0,
        refurbishing: pipelineCounts["Refurbishing"] || pipelineCounts["Refurbished"] || 0,
        qaTesting: pipelineCounts["QA Testing"] || pipelineCounts["QA"] || 0,
        ready: readyCount,
        distributed: distributedCount,
      },
      inPipeline: Math.max(0, totalDevices - distributedCount),
      readyToShip: readyCount,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" // 1hr cache, 2hr stale
      },
    });
  } catch (error: unknown) {
    console.error("Error generating metrics:", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
