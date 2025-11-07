/**
 * Shared status color mappings
 * Centralizes all status-to-color mappings to maintain consistency and reduce duplication
 * Used across InventoryOverview, DonationRequests, and other components
 */

/**
 * Device status color mapping
 * Used in InventoryOverview.tsx and other device-related components
 */
export const DEVICE_STATUS_COLORS: Record<string, string> = {
  ready: "glass-chip glass-chip--teal",
  qa_testing: "glass-chip glass-chip--yellow text-sm",
  refurbishing: "glass-chip glass-chip--orange",
  data_wipe: "glass-chip glass-chip--navy",
  received: "glass-chip glass-chip--slate",
  donated: "glass-chip glass-chip--slate",
  distributed: "glass-chip glass-chip--orange",
  in_process: "glass-chip glass-chip--teal",
  marked_for_sale: "glass-chip glass-chip--yellow text-sm",
  discarded_for_review: "glass-chip glass-chip--red",
  completed_ready: "glass-chip glass-chip--teal",
  completed_discarded: "glass-chip glass-chip--slate",
};

/**
 * Device status human-readable labels
 * Used in InventoryOverview.tsx and other device-related components
 */
export const DEVICE_STATUS_LABELS: Record<string, string> = {
  ready: "Ready to Ship",
  qa_testing: "QA Testing",
  refurbishing: "Refurbishing",
  data_wipe: "Data Wipe",
  received: "Received",
  donated: "Donated",
  distributed: "Distributed",
  in_process: "In Process",
  marked_for_sale: "Marked for Sale",
  discarded_for_review: "Discarded – Review",
  completed_ready: "Completed · Ready",
  completed_discarded: "Completed · Discarded",
};

function normalizeStatus(status: string): string {
  return (status || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Get the color class for a device status
 * Includes fallback to 'received' if status not found
 */
export function getDeviceStatusColor(status: string): string {
  const key = normalizeStatus(status);
  return DEVICE_STATUS_COLORS[key] || DEVICE_STATUS_COLORS.received;
}

/**
 * Get the human-readable label for a device status
 * Includes fallback to the status value itself if not found
 */
export function getDeviceStatusLabel(status: string): string {
  const key = normalizeStatus(status);
  return DEVICE_STATUS_LABELS[key] || status;
}

/**
 * Priority indicator colors
 * Used in DonationRequests.tsx for priority dots
 */
export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-hti-orange",
  high: "bg-hti-orange-yellow",
  normal: "bg-hti-navy",
};

/**
 * Request/Donation status colors for text indicators
 * Used in DonationRequests.tsx for status badges
 */
export const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "text-hti-yellow",
  scheduled: "text-hti-orange",
  in_progress: "text-hti-navy",
  completed: "text-hti-stone",
};

/**
 * Activity type colors
 * Used in ActivityFeed.tsx for activity border and background colors
 */
export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  success: "border border-hti-teal/50 bg-hti-teal/15",
  warning: "border border-hti-yellow/45 bg-hti-yellow/15",
  info: "border border-white/15 bg-white/10",
};

/**
 * Get the color class for an activity type
 */
export function getActivityTypeColor(type: string): string {
  return ACTIVITY_TYPE_COLORS[type] || ACTIVITY_TYPE_COLORS.info;
}

/**
 * Get the color class for a priority level
 */
export function getPriorityColor(priority: string): string {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.normal;
}

/**
 * Get the color class for a request status
 */
export function getRequestStatusColor(status: string): string {
  return REQUEST_STATUS_COLORS[status] || REQUEST_STATUS_COLORS.pending;
}
