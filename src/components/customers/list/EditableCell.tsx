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
      className="w-full min-h-[40px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-pre-wrap break-words overflow-hidden"
      style={{ 
        resize: 'none',
        overflow: 'hidden',
        height: 'auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
      rows={1}
      onInput={(e) => {
        // Auto-resize the textarea
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
      }}
      onBlur={(e) => onSave(facilityId, field, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const cursorPosition = e.currentTarget.selectionStart;
          const textBeforeCursor = e.currentTarget.value.substring(0, cursorPosition);
          const textAfterCursor = e.currentTarget.value.substring(cursorPosition);
          e.currentTarget.value = textBeforeCursor + '\n' + textAfterCursor;
          e.currentTarget.selectionStart = cursorPosition + 1;
          e.currentTarget.selectionEnd = cursorPosition + 1;
          // Trigger the auto-resize
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }
      }}
    />
  );
};