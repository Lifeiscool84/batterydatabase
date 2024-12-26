import { TableCell } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { cn } from "@/lib/utils";

interface FacilityCellProps {
  value: any;
  field: string;
  facilityId: string;
  onSave: (id: string, field: string, value: any) => void;
  type?: "text" | "select" | "number";
  options?: readonly { value: string; label: string; }[];
  className?: string;
}

export const FacilityCell = ({ 
  value, 
  field, 
  facilityId, 
  onSave,
  type,
  options,
  className 
}: FacilityCellProps) => {
  return (
    <TableCell className={cn(
      "p-4 align-top whitespace-normal break-words", 
      type === "select" && "min-w-[120px]",
      field === "address" && "min-w-[300px]",
      field === "general_remarks" && "min-w-[300px]",
      field === "internal_notes" && "min-w-[300px]",
      field === "email" && "min-w-[200px]",
      field === "website" && "min-w-[300px]",
      field === "phone" && "min-w-[150px]",
      className
    )}>
      <div className="w-full">
        <EditableCell
          value={value}
          field={field}
          facilityId={facilityId}
          onSave={onSave}
          type={type}
          options={options}
        />
      </div>
    </TableCell>
  );
};