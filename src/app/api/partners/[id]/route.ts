import { NextResponse } from "next/server";

function mapPartner(record: any) {
  let county = "Unknown";
  if (Array.isArray(record?.field_613_raw) && record.field_613_raw.length > 0) {
    county = record.field_613_raw[0].identifier || record.field_613_raw[0].id || "Unknown";
  } else if (typeof record?.field_613_raw === "string") {
    county = record.field_613_raw;
  }

  let email = "";
  if (typeof record?.field_146_raw === "string") {
    email = record.field_146_raw;
  } else if (record?.field_146_raw?.email) {
    email = record.field_146_raw.email;
  }

  let address = "";
  if (typeof record?.field_612_raw === "string") {
    address = record.field_612_raw;
  } else if (record?.field_612_raw?.full) {
    address = record.field_612_raw.full;
  }

  return {
    id: record?.id,
    name: record?.field_143_raw || "Unknown",
    type: "nonprofit",
    contact_email: email,
    address,
    county,
    devices_received: record?.field_669_raw || 0,
    status: record?.field_679_raw || "pending",
    contact_name: record?.field_554_raw || record?.field_145_raw || "",
    contact_phone: record?.field_147_raw || "",
    notes: record?.field_627_raw || "",
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params;
    const appId = process.env.KNACK_APP_ID;
    const apiKey = process.env.KNACK_API_KEY;
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || "object_22";

    if (!appId || !apiKey) {
      return NextResponse.json({ error: "Knack credentials missing" }, { status: 500 });
    }

    const baseUrl = process.env.KNACK_API_BASE_URL || "https://api.knack.com/v1";
    const response = await fetch(`${baseUrl}/objects/${objectKey}/records/${partnerId}`, {
      method: "GET",
      headers: {
        "X-Knack-Application-Id": appId,
        "X-Knack-REST-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    if (!response.ok) {
      throw new Error(`Knack API error: ${response.status}`);
    }

    const payload = await response.json();
    const record = payload?.record || payload;

    if (!record?.id) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const partner = mapPartner(record);

    return NextResponse.json(partner, {
      headers: { "Cache-Control": "public, s-maxage=600" },
    });
  } catch (error: any) {
    console.error("Partner detail API error:", error);
    const message = error?.message || "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
