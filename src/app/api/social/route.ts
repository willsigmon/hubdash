import { NextResponse } from "next/server";
import { fetchSocialFeed } from "@/lib/social/fetchers";
import type { SocialFeedResponse } from "@/lib/social/types";

export const revalidate = 300;

export async function GET(): Promise<NextResponse<SocialFeedResponse | { error: string }>> {
  try {
    const { posts, platforms } = await fetchSocialFeed();

    return NextResponse.json({
      posts,
      platforms,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const detail =
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : "Failed to load social activity";

    return NextResponse.json(
      {
        error: detail,
      },
      { status: 500 }
    );
  }
}
