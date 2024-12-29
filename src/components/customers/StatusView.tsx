import { FacilitySection } from "./status-view/FacilitySection";
import { useFacilities } from "./status-view/useFacilities";
import type { Location } from "@/pages/Customers";

interface StatusViewProps {
  location: Location;
}

export const StatusView = ({ location }: StatusViewProps) => {
  const { facilities, isLoading, refetch } = useFacilities(location);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <FacilitySection
        title="Active Partners"
        titleColor="text-success"
        facilities={facilities.activePartners}
        onDelete={refetch}
      />

      <FacilitySection
        title="Engaged Prospects"
        titleColor="text-[#0FA0CE]"
        facilities={facilities.engagedProspects}
        onDelete={refetch}
      />

      <FacilitySection
        title="No Response"
        titleColor="text-black"
        facilities={facilities.noResponseContacts}
        onDelete={refetch}
      />

      <FacilitySection
        title="Declined"
        titleColor="text-[#ea384c]"
        facilities={facilities.declinedContacts}
        onDelete={refetch}
      />
    </div>
  );
};