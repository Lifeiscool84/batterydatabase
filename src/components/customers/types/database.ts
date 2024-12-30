import type { Size } from "../constants";

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
  size: Size;
  general_remarks?: string | null;
  internal_notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  location: string;
}

export interface DbPriceHistory {
  date: string;
  buyingPrice: number;
  sellingPrice: number;
  updatedBy: string;
}

export interface DbInteraction {
  created_at: string;
  type: string;
  notes: string;
  user_name: string;
}

export interface DbStatusHistory {
  created_at: string;
  from_status: string;
  to_status: string;
  reason: string;
  user_name: string;
}