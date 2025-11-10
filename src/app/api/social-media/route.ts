import { NextResponse } from "next/server";
import { getKnackClient } from "@/lib/knack/client";
import { cacheKeys, getCached } from "@/lib/knack/cache-manager";

interface SocialMediaPost {
  id: string;
  platform: "instagram" | "linkedin" | "tiktok" | "facebook";
  text: string;
  imageUrl?: string;
  postUrl: string;
  timestamp: string;
  likes?: number;
  comments?: number;
}

/**
 * GET /api/social-media
 *
 * Returns recent social media posts from HTI's accounts.
 *
 * First tries to fetch from Knack if a social media object exists,
 * otherwise falls back to mock data for development.
 *
 * Future integrations:
 * - Instagram Basic Display API or Instagram Graph API
 * - LinkedIn API
 * - TikTok API (when available)
 * - Facebook Graph API
 */
export async function GET() {
  try {
    // Try to fetch from Knack if social media object exists
    const knack = getKnackClient();
    const socialMediaObjectKey = process.env.KNACK_SOCIAL_MEDIA_OBJECT;

    if (socialMediaObjectKey) {
      const posts = await getCached(
        'social-media',
        async () => {
          const knackRecords = await knack.getRecords(socialMediaObjectKey, {
            rows_per_page: 20,
          });

          if (!Array.isArray(knackRecords)) {
            throw new Error('Invalid data format from Knack');
          }

          // Map and sort by timestamp (most recent first)
          const mappedPosts = knackRecords.map((r: any) => ({
            id: r.id,
            platform: r.field_platform?.toLowerCase() || 'instagram',
            text: r.field_text || r.field_caption || '',
            imageUrl: r.field_image_url || r.field_image?.url || undefined,
            postUrl: r.field_post_url || r.field_url || '#',
            timestamp: r.field_timestamp_raw?.iso_timestamp || r.field_timestamp || new Date().toISOString(),
            likes: r.field_likes || 0,
            comments: r.field_comments || 0,
          })) as SocialMediaPost[];

          // Sort by timestamp descending (most recent first)
          return mappedPosts.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA;
          });
        },
        300 // 5 minute cache
      );

      return NextResponse.json(posts, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      });
    }
  } catch (error) {
    console.error('Error fetching social media from Knack:', error);
    // Fall through to mock data
  }

  // Return empty array if no Knack data - don't use mock data
  // User wants REAL data only, no fake images
  return NextResponse.json([], {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60", // 5 min cache
    },
  });
}
