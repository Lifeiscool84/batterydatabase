import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ListHeaderProps {
  location: string;
  onAddFacility: () => void;
}

export const ListHeader = ({ location, onAddFacility }: ListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Facilities in {location}</h2>
      <Button onClick={onAddFacility}>
        <Plus className="mr-2 h-4 w-4" />
        Add Facility
      </Button>
    </div>
  );
};