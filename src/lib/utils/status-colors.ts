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
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  qa_testing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  refurbishing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  data_wipe: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  received: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  donated: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  distributed: "bg-hti-teal/20 text-hti-teal border-hti-teal/30",
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
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
};

/**
 * Request/Donation status colors for text indicators
 * Used in DonationRequests.tsx for status badges
 */
export const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400",
  scheduled: "text-green-400",
  in_progress: "text-blue-400",
  completed: "text-gray-400",
};

/**
 * Activity type colors
 * Used in ActivityFeed.tsx for activity border and background colors
 */
export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  success: "border-green-500/30 bg-green-500/5",
  warning: "border-orange-500/30 bg-orange-500/5",
  info: "border-blue-500/30 bg-blue-500/5",
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
