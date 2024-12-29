import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import { FacilityTableHeader } from "./FacilityTableHeader";
import { FacilityRow } from "./FacilityRow";
import type { Facility } from "../constants";

interface FacilityGroupProps {
  facilities: Facility[];
  title: string;
  titleColor: string;
  onSave: (id: string, field: keyof Facility, value: any) => void;
  onDelete: () => void;
}

export const FacilityGroup = ({ 
  facilities, 
  title, 
  titleColor,
  onSave,
  onDelete 
}: FacilityGroupProps) => {
  if (facilities.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-xl font-semibold mb-4 ${titleColor}`}>
        {title} ({facilities.length})
      </h3>
      <div className="border rounded-md">
        <ScrollArea className="w-full" type="scroll">
          <div className="min-w-[1200px] w-full">
            <Table>
              <FacilityTableHeader />
              <TableBody>
                {facilities.map((facility) => (
                  <FacilityRow
                    key={facility.id}
                    facility={facility}
                    onSave={onSave}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};