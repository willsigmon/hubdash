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
  ready: "bg-hti-ember/20 text-hti-ember border-hti-ember/30",
  qa_testing: "bg-hti-gold/20 text-hti-gold border-hti-gold/30",
  refurbishing: "bg-hti-plum/20 text-hti-plum border-hti-plum/30",
  data_wipe: "bg-hti-fig/20 text-hti-fig border-hti-fig/30",
  received: "bg-hti-stone/20 text-hti-stone border-hti-stone/30",
  donated: "bg-hti-stone/20 text-hti-stone border-hti-stone/30",
  distributed: "bg-hti-sunset/20 text-hti-sunset border-hti-sunset/30",
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
};

/**
 * Get the color class for a device status
 * Includes fallback to 'received' if status not found
 */
export function getDeviceStatusColor(status: string): string {
  return DEVICE_STATUS_COLORS[status] || DEVICE_STATUS_COLORS.received;
}

/**
 * Get the human-readable label for a device status
 * Includes fallback to the status value itself if not found
 */
export function getDeviceStatusLabel(status: string): string {
  return DEVICE_STATUS_LABELS[status] || status;
}

/**
 * Priority indicator colors
 * Used in DonationRequests.tsx for priority dots
 */
export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-hti-ember",
  high: "bg-hti-sunset",
  normal: "bg-hti-plum",
};

/**
 * Request/Donation status colors for text indicators
 * Used in DonationRequests.tsx for status badges
 */
export const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "text-hti-gold",
  scheduled: "text-hti-ember",
  in_progress: "text-hti-plum",
  completed: "text-hti-stone",
};

/**
 * Activity type colors
 * Used in ActivityFeed.tsx for activity border and background colors
 */
export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  success: "border-hti-ember/30 bg-hti-ember/10",
  warning: "border-hti-gold/30 bg-hti-gold/10",
  info: "border-hti-plum/30 bg-hti-plum/10",
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
