import { FacilitySection } from "./status-view/FacilitySection";
import { useFacilities } from "./status-view/useFacilities";
import type { Location } from "@/pages/Customers";

interface StatusViewProps {
  location: Location;
  onUpdate?: () => void;
}

export const StatusView = ({ location, onUpdate }: StatusViewProps) => {
  const { facilities, isLoading, refetch } = useFacilities(location);

  const handleDelete = () => {
    refetch();
    onUpdate?.();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <FacilitySection
        title="Active Partners"
        titleColor="text-success"
        facilities={facilities.activePartners}
        onDelete={handleDelete}
      />

      <FacilitySection
        title="Engaged Prospects"
        titleColor="text-[#0FA0CE]"
        facilities={facilities.engagedProspects}
        onDelete={handleDelete}
      />

      <FacilitySection
        title="No Response"
        titleColor="text-black"
        facilities={facilities.noResponseContacts}
        onDelete={handleDelete}
      />

      <FacilitySection
        title="Declined"
        titleColor="text-[#ea384c]"
        facilities={facilities.declinedContacts}
        onDelete={handleDelete}
      />

      <FacilitySection
        title="Invalid"
        titleColor="text-gray-500"
        facilities={facilities.invalidContacts}
        onDelete={handleDelete}
      />
    </div>
  );
};