import type { DbFacility, MappedFacility } from "../../types";
import { statusMapping } from "../../constants";
import { getValidInteractionType } from "./interactionTypeUtils";

export const mapFacilityToCardProps = (facility: DbFacility): MappedFacility => ({
  id: facility.id,
  name: facility.name,
  status: statusMapping[facility.status],
  address: facility.address,
  phone: facility.phone,
  email: facility.email || undefined,
  website: facility.website || undefined,
  buyingPrice: facility.buying_price || undefined,
  sellingPrice: facility.selling_price || undefined,
  size: facility.size,
  remarks: facility.general_remarks || undefined,
  updatedAt: facility.updated_at || undefined,
  priceHistory: facility.price_history?.map(ph => ({
    date: ph.date,
    buyingPrice: ph.buyingPrice,
    sellingPrice: ph.sellingPrice,
    updatedBy: ph.updatedBy
  })) || [],
  interactions: facility.interactions?.map(int => ({
    date: int.created_at || new Date().toISOString(),
    type: getValidInteractionType(int.type),
    notes: int.notes,
    user: int.user_name
  })) || [],
  statusHistory: facility.status_history?.map(sh => ({
    date: sh.created_at || new Date().toISOString(),
    from: sh.from_status,
    to: sh.to_status,
    reason: sh.reason,
    user: sh.user_name
  })) || [],
  capabilities: facility.capabilities || []
});