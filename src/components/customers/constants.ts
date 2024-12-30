export const VALID_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Engaged", label: "Engaged" },
  { value: "No response", label: "No Response" },
  { value: "Declined", label: "Declined" },
  { value: "Invalid", label: "Invalid" }
] as const;

export const VALID_SIZES = [
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
  { value: "Invalid", label: "Invalid" }
] as const;

export type DbStatus = typeof VALID_STATUSES[number]['value'];
export type DisplayStatus = "active" | "engaged" | "past" | "general" | "invalid";
export type Size = typeof VALID_SIZES[number]['value'];

export const statusMapping: Record<DbStatus, DisplayStatus> = {
  "Active": "active",
  "Engaged": "engaged",
  "No response": "past",
  "Declined": "general",
  "Invalid": "invalid"
};