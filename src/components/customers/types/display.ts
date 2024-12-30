import type { Status } from "@/pages/Customers";
import type { Size } from "../constants";

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
  size: Size;
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
  invalidContacts: MappedFacility[];
}