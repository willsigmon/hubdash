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
  ready: "bg-soft-success text-success border-success/30",
  qa_testing: "bg-soft-warning text-warning border-warning/30",
  refurbishing: "bg-soft-accent text-accent border-accent/30",
  data_wipe: "bg-soft-accent text-accent border-accent/30",
  received: "bg-soft-accent text-accent border-accent/30",
  donated: "bg-soft-accent text-accent border-accent/30",
  distributed: "bg-soft-success text-success border-success/30",
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
  urgent: "bg-danger",
  high: "bg-warning",
  normal: "bg-accent",
};

/**
 * Request/Donation status colors for text indicators
 * Used in DonationRequests.tsx for status badges
 */
export const REQUEST_STATUS_COLORS: Record<string, string> = {
  pending: "text-warning",
  scheduled: "text-accent",
  in_progress: "text-accent",
  completed: "text-secondary",
};

/**
 * Activity type colors
 * Used in ActivityFeed.tsx for activity border and background colors
 */
export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  success: "border-success/30 bg-soft-success",
  warning: "border-warning/30 bg-soft-warning",
  info: "border-accent/30 bg-soft-accent",
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
