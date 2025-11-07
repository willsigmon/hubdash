import type { SocialPost } from "@/lib/social/types";

export const fallbackSocialPosts: SocialPost[] = [
  {
    id: "fallback-facebook-001",
    platform: "facebook",
    message:
      "HTI delivered a fresh batch of 45 Chromebooks to the Digital Champion cohort in Halifax County this week. Huge thanks to the volunteers who helped prep devices!",
    permalink: "https://www.facebook.com/hubzonetech",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    author: "HubZone Technology Initiative",
    mediaUrl: null,
    meta: {
      location: "Halifax County, NC",
    },
  },
  {
    id: "fallback-instagram-001",
    platform: "instagram",
    message:
      "From whiteboard to deployment. Our refurb techs wiped, imaged, and QA'd another 30 laptops in under 48 hours. Swipe to see the liquid-glass UI we're rolling out across HUBDash. 💻✨",
    permalink: "https://www.instagram.com/hubzonetech",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    mediaUrl: null,
  },
  {
    id: "fallback-linkedin-001",
    platform: "linkedin",
    message:
      "We just crossed 2,500 Chromebooks distributed statewide. Proud to partner with NC Commerce on the Digital Champion Grant to keep momentum going.",
    permalink: "https://www.linkedin.com/company/hubzonetech",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    author: "HubZone Technology Initiative",
    mediaUrl: null,
    meta: {
      metric: "2,500+ devices",
    },
  },
  {
    id: "fallback-tiktok-001",
    platform: "tiktok",
    message:
      "POV: you're a retired ThinkPad getting flashed with ChromeOS Flex and a new home in Pembroke. #TechForGood #HubZoneTech",
    permalink: "https://www.tiktok.com/@hubzonetech",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    mediaUrl: null,
  },
];
