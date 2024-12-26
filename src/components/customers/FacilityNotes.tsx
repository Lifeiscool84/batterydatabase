import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { User } from "lucide-react";

interface Note {
  date: string;
  content: string;
  user: string;
}

interface FacilityNotesProps {
  notes: Note[];
}

export const FacilityNotes = ({ notes }: FacilityNotesProps) => {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(note.date), "PPp")}
                </span>
              </div>
              <p className="mt-1 text-sm whitespace-pre-wrap">{note.content}</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                {note.user}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};