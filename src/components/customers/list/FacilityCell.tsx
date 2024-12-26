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
      "min-w-[150px] max-w-none whitespace-normal break-words", 
      type === "select" && "min-w-[120px]",
      field === "general_remarks" && "min-w-[300px]",
      field === "internal_notes" && "min-w-[300px]",
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