export interface Facility {
  id: string;
  name: string;
  status: "Active" | "Engaged" | "No response" | "Declined" | "Invalid";
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  buying_price?: number | null;
  selling_price?: number | null;
  size: "Small" | "Medium" | "Large" | "Invalid";
  general_remarks?: string | null;
  internal_notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  location: string;
}
