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

  // Fallback to mock data for development/demo
  const mockPosts: SocialMediaPost[] = [
    {
      id: "ig_1",
      platform: "instagram",
      text: "Excited to announce our partnership with @local_school! 50 Chromebooks delivered to students in need. #DigitalEquity #HTI #CommunityImpact",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop",
      postUrl: "https://instagram.com/p/example1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      likes: 127,
      comments: 23,
    },
    {
      id: "li_1",
      platform: "linkedin",
      text: "Proud to share that HTI has now distributed over 2,500 Chromebooks across North Carolina. Thank you to all our partners and donors who make this possible. #TechForGood #DigitalInclusion",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=630&fit=crop",
      postUrl: "https://linkedin.com/feed/update/example1",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      likes: 89,
      comments: 12,
    },
    {
      id: "tt_1",
      platform: "tiktok",
      text: "Watch how we transform old laptops into Chromebooks! ♻️💻 #TechRecycling #Chromebook #DigitalEquity #HTI",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=720&h=1280&fit=crop",
      postUrl: "https://tiktok.com/@hubzonetech/video/example1",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      likes: 342,
      comments: 45,
    },
    {
      id: "fb_1",
      platform: "facebook",
      text: "This week we're celebrating 15 counties served! From Henderson to Charlotte, we're bridging the digital divide one Chromebook at a time. Learn more about our impact: hubzonetech.org",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&fit=crop",
      postUrl: "https://facebook.com/hubzonetech/posts/example1",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      likes: 156,
      comments: 28,
    },
  ];

  return NextResponse.json(mockPosts, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60", // 5 min cache
    },
  });
}
