import { FacilityCard } from "./FacilityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Location } from "@/pages/Customers";

interface ListViewProps {
  location: Location;
}

export const ListView = ({ location }: ListViewProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* We'll reuse the same mock data from StatusView for now */}
      </div>
    </ScrollArea>
  );
};