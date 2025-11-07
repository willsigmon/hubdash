export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "tiktok";

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  message: string;
  permalink: string;
  publishedAt: string;
  author?: string;
  mediaUrl?: string | null;
  meta?: Record<string, string | number | null>;
}

export interface SocialPlatformResult {
  platform: SocialPlatform;
  status: "ok" | "unconfigured" | "error";
  posts: SocialPost[];
  error?: string;
  source?: string;
}

export interface SocialFeedResponse {
  posts: SocialPost[];
  platforms: SocialPlatformResult[];
  generatedAt: string;
}
