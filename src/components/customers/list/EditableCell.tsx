import { useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Adjust height on initial render and when value changes
  useEffect(() => {
    adjustHeight();
  }, [value]);

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
      ref={textareaRef}
      defaultValue={value?.toString() || ''}
      className="w-full min-h-[40px] p-2 rounded-md border border-input bg-background text-sm 
                ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                whitespace-pre-wrap break-words resize-none"
      style={{ 
        height: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '40px',
        overflowY: 'hidden'
      }}
      rows={1}
      onInput={adjustHeight}
      onBlur={(e) => {
        onSave(facilityId, field, e.target.value);
        adjustHeight();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const cursorPosition = e.currentTarget.selectionStart;
          const textBeforeCursor = e.currentTarget.value.substring(0, cursorPosition);
          const textAfterCursor = e.currentTarget.value.substring(cursorPosition);
          e.currentTarget.value = textBeforeCursor + '\n' + textAfterCursor;
          e.currentTarget.selectionStart = cursorPosition + 1;
          e.currentTarget.selectionEnd = cursorPosition + 1;
          adjustHeight();
        }
      }}
    />
  );
};