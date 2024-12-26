export const VALID_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Engaged", label: "Engaged" },
  { value: "No response", label: "No response" },
  { value: "Declined", label: "Declined" }
] as const;

export const VALID_SIZES = [
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" }
] as const;

export type Status = typeof VALID_STATUSES[number]['value'];
export type Size = typeof VALID_SIZES[number]['value'];