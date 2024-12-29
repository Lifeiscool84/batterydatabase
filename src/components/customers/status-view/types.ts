import type { Status } from "@/pages/Customers";

export type InteractionType = "call" | "email" | "meeting" | "other";

export interface PriceHistory {
  date: string;
  buyingPrice: number;
  sellingPrice: number;
  updatedBy: string;
}

export interface Interaction {
  date: string;
  type: InteractionType;
  notes: string;
  user: string;
}

export interface StatusHistory {
  date: string;
  from: string;
  to: string;
  reason: string;
  user: string;
}

export interface DbPriceHistory {
  date: string;
  buyingPrice: number;
  sellingPrice: number;
  updatedBy: string;
}

export interface DbInteraction {
  id: string;
  facility_id: string | null;
  type: string;
  notes: string;
  user_name: string;
  created_at: string | null;
}

export interface DbStatusHistory {
  id: string;
  facility_id: string | null;
  from_status: string;
  to_status: string;
  reason: string;
  user_name: string;
  created_at: string | null;
}

export interface DbFacility {
  id: string;
  name: string;
  status: string;
  address: string;
  phone: string;
  email: string | null;
  website: string | null;
  buying_price: number | null;
  selling_price: number | null;
  size: "Small" | "Medium" | "Large";
  general_remarks: string | null;
  internal_notes: string | null;
  updated_at: string | null;
  price_history?: DbPriceHistory[];
  interactions?: DbInteraction[];
  status_history?: DbStatusHistory[];
  capabilities?: string[];
}

export interface MappedFacility {
  id: string;
  name: string;
  status: Status;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buyingPrice?: number;
  sellingPrice?: number;
  size: "Small" | "Medium" | "Large";
  remarks?: string;
  updatedAt?: string;
  priceHistory: PriceHistory[];
  interactions: Interaction[];
  statusHistory: StatusHistory[];
  capabilities: string[];
}

export interface FacilityGroups {
  activePartners: MappedFacility[];
  engagedProspects: MappedFacility[];
  noResponseContacts: MappedFacility[];
  declinedContacts: MappedFacility[];
}