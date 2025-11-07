interface KnackMessage {
  title: string;
  message: string;
  detail?: string;
}

function sanitize(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export function interpretKnackError(raw?: string | null): KnackMessage {
  const fallback: KnackMessage = {
    title: "Data is taking a quick breather",
    message: "Knack paused responses for a moment. Give it another try in a bit.",
  };

  if (!raw) {
    return fallback;
  }

  let parsedText = raw;

  try {
    const parsed = JSON.parse(raw);
    const error = typeof parsed?.error === "string" ? parsed.error : undefined;
    const message = typeof parsed?.message === "string" ? parsed.message : undefined;
    parsedText = sanitize([error, message].filter(Boolean).join(": ")) || raw;
  } catch (error) {
    parsedText = sanitize(raw.replace(/^Knack request failed:?/i, ""));
  }

  const lower = parsedText.toLowerCase();

  if (lower.includes("plan limit exceeded") || lower.includes("rate limit")) {
    return {
      title: "Today's Knack limit is maxed",
      message: "We’ve reached the daily Knack API allotment, so live data is paused for now.",
      detail: "Limits reset at midnight Eastern. You can retry then or upgrade the Knack plan for additional calls.",
    };
  }

  if (lower.includes("not configured") || lower.includes("missing api")) {
    return {
      title: "Connect Knack to unlock live numbers",
      message: "We couldn’t find valid Knack credentials. Add them to resume real-time dashboards.",
      detail: "Run npm run setup-knack with your API key from Knack Builder → Settings → API & Code.",
    };
  }

  if (lower.includes("maintenance")) {
    return {
      title: "Knack is under maintenance",
      message: "Knack scheduled maintenance is in progress, so requests are temporarily paused.",
      detail: "We’ll try again automatically once Knack is back online.",
    };
  }

  return {
    title: "We hit a Knack speed bump",
    message: parsedText || fallback.message,
    detail: "Try again shortly. If this keeps happening, check the Knack status page or API limits.",
  };
}
