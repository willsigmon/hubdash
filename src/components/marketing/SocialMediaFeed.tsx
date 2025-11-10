"use client";

import { formatTimeAgo } from "@/lib/utils/date-formatters";
import { Facebook, Instagram, Linkedin, Music2 } from "lucide-react";
import { useEffect, useState } from "react";

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

const platformConfig = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    // Instagram brand gradient: Pink to Purple
    gradient: "from-[#E4405F] via-[#C13584] to-[#833AB4]",
    bgGradient: "bg-gradient-to-br from-[#E4405F]/10 via-[#C13584]/10 to-[#833AB4]/10",
    borderColor: "border-[#E4405F]/40",
    textColor: "text-primary",
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    // LinkedIn brand blue
    gradient: "from-[#0077B5] to-[#004182]",
    bgGradient: "bg-gradient-to-br from-[#0077B5]/10 to-[#004182]/10",
    borderColor: "border-[#0077B5]/40",
    textColor: "text-primary",
  },
  tiktok: {
    name: "TikTok",
    icon: Music2,
    // TikTok brand: Black to Red
    gradient: "from-[#000000] via-[#161823] to-[#FF0050]",
    bgGradient: "bg-gradient-to-br from-[#000000]/10 via-[#161823]/10 to-[#FF0050]/10",
    borderColor: "border-[#FF0050]/40",
    textColor: "text-primary",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    // Facebook brand blue
    gradient: "from-[#1877F2] to-[#0A5FCC]",
    bgGradient: "bg-gradient-to-br from-[#1877F2]/10 to-[#0A5FCC]/10",
    borderColor: "border-[#1877F2]/40",
    textColor: "text-primary",
  },
};

export default function SocialMediaFeed() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/social-media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching social media posts:", error);
        setLoading(false);
      });
  }, []);

  const postsByPlatform = {
    instagram: posts.filter((p) => p.platform === "instagram"),
    linkedin: posts.filter((p) => p.platform === "linkedin"),
    tiktok: posts.filter((p) => p.platform === "tiktok"),
    facebook: posts.filter((p) => p.platform === "facebook"),
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border-2 border-default bg-surface p-4 animate-pulse shadow-lg">
            <div className="h-12 bg-surface-alt rounded mb-4" />
            <div className="h-32 bg-surface-alt rounded mb-3" />
            <div className="h-4 bg-surface-alt rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-4xl md:text-5xl font-black text-primary mb-3">Recent Social Media Posts</h2>
        <p className="text-base md:text-lg font-semibold text-secondary">Latest posts from HTI's social media accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram */}
        <div className={`rounded-2xl border-2 ${platformConfig.instagram.borderColor} ${platformConfig.instagram.bgGradient} overflow-hidden shadow-xl hover:shadow-2xl transition-all`}>
          <div className={`bg-gradient-to-r ${platformConfig.instagram.gradient} p-5 flex items-center gap-3`}>
            <Instagram className="h-6 w-6 text-white" />
            <span className="text-white font-black text-lg">{platformConfig.instagram.name}</span>
          </div>
          <div className="p-5 space-y-4">
            {postsByPlatform.instagram.length > 0 ? (
              postsByPlatform.instagram.slice(0, 2).map((post) => (
                <div key={post.id} className="space-y-3">
                  <p className="text-lg md:text-xl font-bold text-primary leading-relaxed">
                    {post.text}
                  </p>
                  {post.imageUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group rounded-xl overflow-hidden bg-surface-alt hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={post.imageUrl}
                        alt="Instagram post"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  )}
                  <div className="flex items-center justify-between text-sm font-medium text-secondary">
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {formatTimeAgo(post.timestamp)}
                    </a>
                    {post.likes && <span className="font-bold">❤️ {post.likes.toLocaleString()}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-secondary text-base">
                <Instagram className="h-12 w-12 mx-auto mb-3 text-muted" />
                <p className="font-semibold">No recent posts</p>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className={`rounded-2xl border-2 ${platformConfig.linkedin.borderColor} ${platformConfig.linkedin.bgGradient} overflow-hidden shadow-xl hover:shadow-2xl transition-all`}>
          <div className={`bg-gradient-to-r ${platformConfig.linkedin.gradient} p-5 flex items-center gap-3`}>
            <Linkedin className="h-6 w-6 text-white" />
            <span className="text-white font-black text-lg">{platformConfig.linkedin.name}</span>
          </div>
          <div className="p-5 space-y-4">
            {postsByPlatform.linkedin.length > 0 ? (
              postsByPlatform.linkedin.slice(0, 2).map((post) => (
                <div key={post.id} className="space-y-3">
                  <p className="text-lg md:text-xl font-bold text-primary leading-relaxed">
                    {post.text}
                  </p>
                  {post.imageUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group rounded-xl overflow-hidden bg-surface-alt hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={post.imageUrl}
                        alt="LinkedIn post"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  )}
                  <div className="flex items-center justify-between text-sm font-medium text-secondary">
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {formatTimeAgo(post.timestamp)}
                    </a>
                    {post.likes && <span className="font-bold">👍 {post.likes.toLocaleString()}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-secondary text-base">
                <Linkedin className="h-12 w-12 mx-auto mb-3 text-muted" />
                <p className="font-semibold">No recent posts</p>
              </div>
            )}
          </div>
        </div>

        {/* TikTok */}
        <div className={`rounded-2xl border-2 ${platformConfig.tiktok.borderColor} ${platformConfig.tiktok.bgGradient} overflow-hidden shadow-xl hover:shadow-2xl transition-all`}>
          <div className={`bg-gradient-to-r ${platformConfig.tiktok.gradient} p-5 flex items-center gap-3`}>
            <Music2 className="h-6 w-6 text-white" />
            <span className="text-white font-black text-lg">{platformConfig.tiktok.name}</span>
          </div>
          <div className="p-5 space-y-4">
            {postsByPlatform.tiktok.length > 0 ? (
              postsByPlatform.tiktok.slice(0, 2).map((post) => (
                <div key={post.id} className="space-y-3">
                  <p className="text-lg md:text-xl font-bold text-primary leading-relaxed">
                    {post.text}
                  </p>
                  {post.imageUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group rounded-xl overflow-hidden bg-surface-alt hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={post.imageUrl}
                        alt="TikTok post"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  )}
                  <div className="flex items-center justify-between text-sm font-medium text-secondary">
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {formatTimeAgo(post.timestamp)}
                    </a>
                    {post.likes && <span className="font-bold">❤️ {post.likes.toLocaleString()}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-secondary text-base">
                <Music2 className="h-12 w-12 mx-auto mb-3 text-muted" />
                <p className="font-semibold">No recent posts</p>
              </div>
            )}
          </div>
        </div>

        {/* Facebook */}
        <div className={`rounded-2xl border-2 ${platformConfig.facebook.borderColor} ${platformConfig.facebook.bgGradient} overflow-hidden shadow-xl hover:shadow-2xl transition-all`}>
          <div className={`bg-gradient-to-r ${platformConfig.facebook.gradient} p-5 flex items-center gap-3`}>
            <Facebook className="h-6 w-6 text-white" />
            <span className="text-white font-black text-lg">{platformConfig.facebook.name}</span>
          </div>
          <div className="p-5 space-y-4">
            {postsByPlatform.facebook.length > 0 ? (
              postsByPlatform.facebook.slice(0, 2).map((post) => (
                <div key={post.id} className="space-y-3">
                  <p className="text-lg md:text-xl font-bold text-primary leading-relaxed">
                    {post.text}
                  </p>
                  {post.imageUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group rounded-xl overflow-hidden bg-surface-alt hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={post.imageUrl}
                        alt="Facebook post"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                  )}
                  <div className="flex items-center justify-between text-sm font-medium text-secondary">
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      {formatTimeAgo(post.timestamp)}
                    </a>
                    {post.likes && <span className="font-bold">👍 {post.likes.toLocaleString()}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-secondary text-base">
                <Facebook className="h-12 w-12 mx-auto mb-3 text-muted" />
                <p className="font-semibold">No recent posts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
