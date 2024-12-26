import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditableCellProps {
  value: any;
  field: string;
  facilityId: string;
  onSave: (id: string, field: string, value: any) => void;
  type?: "text" | "select" | "number";
  options?: readonly { value: string; label: string; }[];
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
    <textarea
      defaultValue={value?.toString() || ''}
      className="w-full min-h-[40px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ 
        resize: 'none',
        overflow: 'hidden',
        height: 'auto'
      }}
      rows={1}
      onInput={(e) => {
        // Auto-resize the textarea
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
      }}
      onBlur={(e) => onSave(facilityId, field, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSave(facilityId, field, e.currentTarget.value);
        }
      }}
    />
  );
};