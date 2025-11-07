import { fallbackSocialPosts } from "@/data/social-fallback";
import type { SocialPlatformResult, SocialPost } from "./types";

type Fetcher = () => Promise<SocialPlatformResult>;

interface GraphApiError {
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
}

const FACEBOOK_API_VERSION = process.env.FACEBOOK_GRAPH_VERSION || "v18.0";

function normaliseMessage(text?: string | null): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function buildErrorResult(platform: SocialPlatformResult["platform"], error: unknown): SocialPlatformResult {
  const detail =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : JSON.stringify(error);

  return {
    platform,
    status: "error",
    posts: [],
    error: detail,
  };
}

const fetchFacebookPosts: Fetcher = async () => {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_GRAPH_TOKEN;

  if (!pageId || !token) {
    return {
      platform: "facebook",
      status: "unconfigured",
      posts: [],
    };
  }

  try {
    const url = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/posts`);
    url.searchParams.set(
      "fields",
      ["message", "permalink_url", "created_time", "full_picture", "story"].join(",")
    );
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as GraphApiError | null;
      const message = payload?.error?.message || response.statusText;
      throw new Error(`Facebook API: ${message}`);
    }

    const payload = await response.json();
    const entries = Array.isArray(payload?.data) ? payload.data : [];
    const posts: SocialPost[] = entries
      .map((entry: any) => {
        const id = entry.id as string | undefined;
        const message = normaliseMessage(entry.message || entry.story);
        const permalink = entry.permalink_url as string | undefined;
        const publishedAt = entry.created_time as string | undefined;

        if (!id || !permalink || !publishedAt) {
          return null;
        }

        return {
          id,
          platform: "facebook",
          message: message || "No message provided",
          permalink,
          publishedAt: new Date(publishedAt).toISOString(),
          author: "HubZone Technology Initiative",
          mediaUrl: entry.full_picture || null,
        } satisfies SocialPost;
      })
      .filter(Boolean) as SocialPost[];

    return {
      platform: "facebook",
      status: "ok",
      posts,
      source: url.toString(),
    };
  } catch (error) {
    return buildErrorResult("facebook", error);
  }
};

const fetchInstagramPosts: Fetcher = async () => {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = process.env.FACEBOOK_GRAPH_TOKEN;

  if (!accountId || !token) {
    return {
      platform: "instagram",
      status: "unconfigured",
      posts: [],
    };
  }

  try {
    const url = new URL(`https://graph.facebook.com/${FACEBOOK_API_VERSION}/${accountId}/media`);
    url.searchParams.set(
      "fields",
      ["caption", "permalink", "timestamp", "media_url", "media_type", "thumbnail_url"].join(",")
    );
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as GraphApiError | null;
      const message = payload?.error?.message || response.statusText;
      throw new Error(`Instagram API: ${message}`);
    }

    const payload = await response.json();
    const entries = Array.isArray(payload?.data) ? payload.data : [];
    const posts: SocialPost[] = entries
      .map((entry: any) => {
        const id = entry.id as string | undefined;
        const caption = normaliseMessage(entry.caption);
        const permalink = entry.permalink as string | undefined;
        const timestamp = entry.timestamp as string | undefined;

        if (!id || !permalink || !timestamp) {
          return null;
        }

        return {
          id,
          platform: "instagram",
          message: caption || "",
          permalink,
          publishedAt: new Date(timestamp).toISOString(),
          mediaUrl: entry.media_url || entry.thumbnail_url || null,
        } satisfies SocialPost;
      })
      .filter(Boolean) as SocialPost[];

    return {
      platform: "instagram",
      status: "ok",
      posts,
      source: url.toString(),
    };
  } catch (error) {
    return buildErrorResult("instagram", error);
  }
};

const fetchLinkedInPosts: Fetcher = async () => {
  const organizationUrn = process.env.LINKEDIN_ORGANIZATION_URN;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;

  if (!organizationUrn || !token) {
    return {
      platform: "linkedin",
      status: "unconfigured",
      posts: [],
    };
  }

  try {
    const url = new URL("https://api.linkedin.com/v2/ugcPosts");
    url.searchParams.set("q", "authors");
    url.searchParams.set("authors", `List(${organizationUrn})`);
    url.searchParams.set("sortBy", "LAST_MODIFIED");
    url.searchParams.set("count", "6");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`LinkedIn API: ${payload}`);
    }

    const payload = await response.json();
    const elements = Array.isArray(payload?.elements) ? payload.elements : [];
    const posts: SocialPost[] = elements
      .map((element: any) => {
        const id = element.id as string | undefined;
        const specificContent = element.specificContent?.["com.linkedin.ugc.ShareContent"];
        const text = specificContent?.shareCommentary?.text as string | undefined;
        const createdTime = element.created?.time as number | undefined;
        const permalink = element.permalink as string | undefined;

        if (!id || !createdTime) {
          return null;
        }

        return {
          id,
          platform: "linkedin",
          message: normaliseMessage(text) || "",
          permalink: permalink || `https://www.linkedin.com/feed/update/${id}`,
          publishedAt: new Date(createdTime).toISOString(),
          mediaUrl: null,
        } satisfies SocialPost;
      })
      .filter(Boolean) as SocialPost[];

    return {
      platform: "linkedin",
      status: "ok",
      posts,
      source: url.toString(),
    };
  } catch (error) {
    return buildErrorResult("linkedin", error);
  }
};

const fetchTikTokPosts: Fetcher = async () => {
  const username = process.env.TIKTOK_USERNAME;
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_TIKTOK_HOST || "tiktok-scraper7.p.rapidapi.com";

  if (!username || !rapidApiKey) {
    return {
      platform: "tiktok",
      status: "unconfigured",
      posts: [],
    };
  }

  try {
    const url = new URL(`https://${rapidApiHost}/user/posts`);
    url.searchParams.set("uniqueId", username);
    url.searchParams.set("count", "10");

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": rapidApiHost,
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`TikTok API: ${payload}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data : [];
    const posts: SocialPost[] = items
      .map((item: any) => {
        const id = item.id as string | undefined;
        const desc = normaliseMessage(item.desc);
        const createTime = Number(item.createTime);
        const link = item.shareUrl || item.video?.downloadAddr || null;

        if (!id || !createTime) {
          return null;
        }

        return {
          id,
          platform: "tiktok",
          message: desc || "",
          permalink: link || `https://www.tiktok.com/@${username}/video/${id}`,
          publishedAt: new Date(createTime * 1000).toISOString(),
          mediaUrl: item.video?.cover || null,
        } satisfies SocialPost;
      })
      .filter(Boolean) as SocialPost[];

    return {
      platform: "tiktok",
      status: "ok",
      posts,
      source: url.toString(),
    };
  } catch (error) {
    return buildErrorResult("tiktok", error);
  }
};

const providers: Fetcher[] = [
  fetchInstagramPosts,
  fetchFacebookPosts,
  fetchLinkedInPosts,
  fetchTikTokPosts,
];

export async function fetchSocialFeed(): Promise<{
  posts: SocialPost[];
  platforms: SocialPlatformResult[];
}> {
  const platformResults = await Promise.all(providers.map((provider) => provider()));

  const collectedPosts = platformResults.flatMap((result) => result.posts);

  if (collectedPosts.length === 0) {
    return {
      platforms: platformResults,
      posts: fallbackSocialPosts,
    };
  }

  const posts = collectedPosts
    .filter((post) => Boolean(post.publishedAt))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 16);

  return {
    platforms: platformResults,
    posts,
  };
}
