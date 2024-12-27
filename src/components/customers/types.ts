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