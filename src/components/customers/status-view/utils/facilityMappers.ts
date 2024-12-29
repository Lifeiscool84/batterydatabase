import type { DbFacility, MappedFacility } from "../types";
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
  lastContact: facility.last_contact || 'No contact recorded',
  size: facility.size,
  remarks: facility.general_remarks || undefined,
  priceHistory: facility.price_history?.map(ph => ({
    date: ph.created_at || new Date().toISOString(),
    buyingPrice: ph.buying_price || 0,
    sellingPrice: ph.selling_price || 0,
    updatedBy: ph.updated_by
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