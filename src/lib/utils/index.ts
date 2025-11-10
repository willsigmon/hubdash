/**
 * Centralized exports for all utility functions
 * Simplifies imports across the application
 */

// Date formatters
export {
  formatDate,
  formatDateLocale,
  formatTimeAgo,
  formatTimeAgoShort,
} from "./date-formatters";

// Status colors and labels
export {
  ACTIVITY_TYPE_COLORS,
  DEVICE_STATUS_COLORS,
  DEVICE_STATUS_LABELS,
  PRIORITY_COLORS,
  REQUEST_STATUS_COLORS,
  getActivityTypeColor,
  getDeviceStatusColor,
  getDeviceStatusLabel,
  getPriorityColor,
  getRequestStatusColor,
} from "./status-colors";
