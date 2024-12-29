import { FacilityCard } from "../FacilityCard";
import type { Status } from "@/pages/Customers";
import type { MappedFacility } from "../types/display";

interface FacilitySectionProps {
  title: string;
  titleColor: string;
  facilities: MappedFacility[];
}

export const FacilitySection = ({ title, titleColor, facilities }: FacilitySectionProps) => {
  return (
    <section>
      <h2 className={`text-xl font-semibold mb-4 ${titleColor}`}>
        {title} ({facilities.length})
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map(facility => (
          <FacilityCard 
            key={facility.id} 
            facility={facility} 
          />
        ))}
      </div>
    </section>
  );
};