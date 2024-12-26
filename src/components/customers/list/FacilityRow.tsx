import { TableRow } from "@/components/ui/table";
import { FacilityCell } from "./FacilityCell";
import { VALID_STATUSES, VALID_SIZES, Status, Size } from "../constants";

interface FacilityRowProps {
  facility: {
    id: string;
    name: string;
    status: Status;
    address: string;
    phone: string;
    email?: string;
    website?: string;
    buying_price?: number;
    selling_price?: number;
    size: Size;
    general_remarks?: string;
    internal_notes?: string;
  };
  onSave: (id: string, field: string, value: any) => void;
}

export const FacilityRow = ({ facility, onSave }: FacilityRowProps) => {
  return (
    <TableRow>
      <FacilityCell
        value={facility.name}
        field="name"
        facilityId={facility.id}
        onSave={onSave}
      />
      <FacilityCell
        value={facility.status}
        field="status"
        facilityId={facility.id}
        onSave={onSave}
        type="select"
        options={VALID_STATUSES}
      />
      <FacilityCell
        value={facility.address}
        field="address"
        facilityId={facility.id}
        onSave={onSave}
      />
      <FacilityCell
        value={facility.phone}
        field="phone"
        facilityId={facility.id}
        onSave={onSave}
      />
      <FacilityCell
        value={facility.size}
        field="size"
        facilityId={facility.id}
        onSave={onSave}
        type="select"
        options={VALID_SIZES}
      />
      <FacilityCell
        value={facility.email}
        field="email"
        facilityId={facility.id}
        onSave={onSave}
      />
      <FacilityCell
        value={facility.website}
        field="website"
        facilityId={facility.id}
        onSave={onSave}
      />
      <FacilityCell
        value={facility.buying_price}
        field="buying_price"
        facilityId={facility.id}
        onSave={onSave}
        type="number"
      />
      <FacilityCell
        value={facility.selling_price}
        field="selling_price"
        facilityId={facility.id}
        onSave={onSave}
        type="number"
      />
      <FacilityCell
        value={facility.general_remarks}
        field="general_remarks"
        facilityId={facility.id}
        onSave={onSave}
        className="min-w-[200px]"
      />
      <FacilityCell
        value={facility.internal_notes}
        field="internal_notes"
        facilityId={facility.id}
        onSave={onSave}
        className="min-w-[200px]"
      />
    </TableRow>
  );
};