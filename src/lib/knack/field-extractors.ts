/**
 * Field extraction utilities for Knack API responses
 * Centralizes repeated field extraction logic used across components
 * Prevents 150+ lines of duplicate field parsing code
 */

/**
 * Extract string value from a Knack field
 * Handles null, undefined, and various object shapes
 */
export const extractString = (field: any): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    if (field.text) return String(field.text);
    if (field.value) return String(field.value);
    if (field.display_value) return String(field.display_value);
  }
  return String(field || "");
};

/**
 * Extract email address from a Knack field
 * Validates basic email format
 */
export const extractEmail = (field: any): string => {
  const email = extractString(field);
  return email && email.includes("@") ? email : "";
};

/**
 * Extract phone number from a Knack field
 * Returns the string as-is (formatting is handled by display layer)
 */
export const extractPhone = (field: any): string => {
  return extractString(field);
};

/**
 * Extract address components from a Knack field
 * Handles both string and object formats
 */
export const extractAddress = (field: any): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    // Handle address objects with street, city, state, zip
    if (field.street || field.address) {
      const parts = [
        field.street || field.address,
        field.city,
        field.state,
        field.zip,
      ].filter(Boolean);
      return parts.join(", ");
    }
    // Fall back to text or value
    if (field.text) return String(field.text);
    if (field.value) return String(field.value);
  }
  return String(field || "");
};

/**
 * Extract date from a Knack field
 * Returns ISO string or formatted date
 */
export const extractDate = (field: any): string => {
  const dateStr = extractString(field);
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // Return YYYY-MM-DD
  } catch {
    return dateStr; // Return as-is if parsing fails
  }
};

/**
 * Extract array values from a Knack field
 * Handles comma-separated strings, arrays, and multiple select fields
 */
export const extractArray = (field: any): string[] => {
  if (!field) return [];

  if (Array.isArray(field)) {
    return field.map(item => extractString(item)).filter(Boolean);
  }

  if (typeof field === "string") {
    return field.split(",").map(s => s.trim()).filter(Boolean);
  }

  if (typeof field === "object") {
    if (Array.isArray(field.values)) {
      return field.values.map((item: any) => extractString(item)).filter(Boolean);
    }
    if (field.text) {
      return [field.text];
    }
  }

  return [];
};

/**
 * Extract numeric value from a Knack field
 * Returns 0 if invalid
 */
export const extractNumber = (field: any): number => {
  if (!field) return 0;

  if (typeof field === "number") return field;
  if (typeof field === "string") {
    const num = parseInt(field, 10);
    return isNaN(num) ? 0 : num;
  }

  if (typeof field === "object" && field.value) {
    return typeof field.value === "number"
      ? field.value
      : parseInt(String(field.value), 10) || 0;
  }

  return 0;
};

/**
 * Extract boolean value from a Knack field
 * Handles various truthy/falsy representations
 */
export const extractBoolean = (field: any): boolean => {
  if (!field) return false;

  if (typeof field === "boolean") return field;
  if (typeof field === "string") {
    return ["true", "yes", "1", "on"].includes(field.toLowerCase());
  }
  if (typeof field === "number") return field !== 0;

  return false;
};

/**
 * Partnership application field mappings
 * Maps Knack field IDs to semantic names
 * Update these IDs based on your actual Knack configuration
 */
export const PARTNERSHIP_FIELDS = {
  email: "field_425",
  organizationName: "field_426",
  contactPerson: "field_427",
  phoneNumber: "field_428",
  address: "field_429",
  city: "field_430",
  county: "field_431",
  chromebooksNeeded: "field_432",
  howWillUse: "field_433",
  positiveImpact: "field_434",
  clientStruggles: "field_435",
  is501c3: "field_436",
  status: "field_437",
};

/**
 * Recipient application field mappings
 * Update these IDs based on your actual Knack configuration
 */
export const RECIPIENT_FIELDS = {
  name: "field_500",
  email: "field_501",
  phoneNumber: "field_502",
  county: "field_503",
  occupation: "field_504",
  reasonForApplication: "field_505",
  domesticStatus: "field_506",
  studentStatus: "field_507",
  veteranStatus: "field_508",
  quote: "field_509",
  status: "field_510",
  datePresented: "field_511",
};

/**
 * Device field mappings
 * Update these IDs based on your actual Knack configuration
 */
export const DEVICE_FIELDS = {
  serialNumber: "field_600",
  manufacturer: "field_601",
  model: "field_602",
  status: "field_603",
  location: "field_604",
  assignedTo: "field_605",
  receivedDate: "field_606",
  distributedDate: "field_607",
  partnerId: "field_608",
  techId: "field_609",
  notes: "field_610",
};

/**
 * Helper function to extract a field value using field mapping
 * Example: extractField(knackRecord, PARTNERSHIP_FIELDS.email)
 */
export const extractField = (record: any, fieldId: string): string => {
  if (!record || !fieldId) return "";

  // Knack API typically returns fields under a property name matching the field ID
  const field = record[fieldId];
  return extractString(field);
};

/**
 * Helper function to extract multiple related fields as an object
 * Example: extractPartnershipData(knackRecord, PARTNERSHIP_FIELDS)
 */
export const extractMultipleFields = (
  record: any,
  fieldMap: Record<string, string>
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, fieldId] of Object.entries(fieldMap)) {
    result[key] = extractField(record, fieldId);
  }

  return result;
};
