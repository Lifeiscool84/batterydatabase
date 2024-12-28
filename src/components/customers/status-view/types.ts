import type { Status } from "@/pages/Customers";
import type { PriceHistory, Interaction, StatusHistory } from "../types";

export interface DbFacility {
  id: string;
  name: string;
  status: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  last_contact?: string;
  size: "Small" | "Medium" | "Large";
  general_remarks?: string;
  internal_notes?: string;
  price_history?: {
    date: string;
    buyingPrice: number;
    sellingPrice: number;
    updatedBy: string;
  }[];
  interactions?: {
    date: string;
    type: string;
    notes: string;
    user: string;
  }[];
  status_history?: {
    date: string;
    from: string;
    to: string;
    reason: string;
    user: string;
  }[];
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
  lastContact: string;
  size: "Small" | "Medium" | "Large";
  remarks?: string;
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