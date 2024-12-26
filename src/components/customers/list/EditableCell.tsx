import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditableCellProps {
  value: any;
  field: string;
  facilityId: string;
  onSave: (id: string, field: string, value: any) => void;
  type?: "text" | "select" | "number";
  options?: { value: string; label: string }[];
}

export const EditableCell = ({ 
  value, 
  field, 
  facilityId, 
  onSave, 
  type = "text",
  options = []
}: EditableCellProps) => {
  if (type === "select" && options.length > 0) {
    return (
      <Select
        defaultValue={value}
        onValueChange={(value) => onSave(facilityId, field, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={type}
      defaultValue={value?.toString() || ''}
      className="w-full truncate"
      onBlur={(e) => onSave(facilityId, field, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSave(facilityId, field, e.currentTarget.value);
        }
      }}
    />
  );
};