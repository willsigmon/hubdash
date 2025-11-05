/**
 * Shared date and time formatting utilities
 * Used across components to maintain consistency and reduce duplication
 */

/**
 * Format a date string into relative time (e.g., "2 hours ago", "Yesterday", "3 days ago")
 * Used in DonationRequests, ActivityFeed, and other components
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Format a date string into human-readable format or relative time
 * Used in DonationRequests component
 * Returns: "Today", "Yesterday", "X days ago", or full date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString();
}

/**
 * Format a date for display in locale-specific format
 * Used when showing received dates and other timestamps
 */
export function formatDateLocale(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Get time ago in shorter format for space-constrained UIs
 * Returns: "1s", "5m", "2h", "3d"
 */
export function formatTimeAgoShort(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
