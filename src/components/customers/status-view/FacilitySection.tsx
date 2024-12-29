import { FacilityCard } from "../FacilityCard";
import type { MappedFacility } from "../types/display";

interface FacilitySectionProps {
  title: string;
  titleColor: string;
  facilities: MappedFacility[];
  onDelete?: () => void;
}

export const FacilitySection = ({ title, titleColor, facilities, onDelete }: FacilitySectionProps) => {
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
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};