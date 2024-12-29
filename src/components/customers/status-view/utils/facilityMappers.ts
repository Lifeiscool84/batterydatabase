import type { DbFacility, MappedFacility } from "../types";
import { statusMapping } from "../../constants";
import { getValidInteractionType } from "./interactionTypeUtils";

export const mapFacilityToCardProps = (facility: DbFacility): MappedFacility => ({
  id: facility.id,
  name: facility.name,
  status: statusMapping[facility.status],
  address: facility.address,
  phone: facility.phone,
  email: facility.email,
  website: facility.website,
  buyingPrice: facility.buying_price,
  sellingPrice: facility.selling_price,
  lastContact: facility.last_contact || 'No contact recorded',
  size: facility.size,
  remarks: facility.general_remarks,
  priceHistory: facility.price_history?.map(ph => ({
    date: ph.date,
    buyingPrice: ph.buyingPrice,
    sellingPrice: ph.sellingPrice,
    updatedBy: ph.updatedBy
  })) || [],
  interactions: facility.interactions?.map(int => ({
    date: int.date,
    type: getValidInteractionType(int.type),
    notes: int.notes,
    user: int.user
  })) || [],
  statusHistory: facility.status_history || [],
  capabilities: facility.capabilities || []
});