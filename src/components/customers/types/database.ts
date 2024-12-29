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