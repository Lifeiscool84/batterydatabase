import { useState, useEffect } from "react";
import type { Location } from "@/pages/Customers";
import type { DbStatus, Size } from "./constants";
import { ListHeader } from "./list/ListHeader";
import { FacilityGroup } from "./list/FacilityGroup";
import { useFacilities } from "./list/useFacilities";
import { useFacilityActions } from "./list/useFacilityActions";
import type { Facility } from "./types/database";

interface ListViewProps {
  location: Location;
  onLocationCountsChange: (counts: Record<Location, number>) => void;
}

type GroupedFacilities = {
  active: Facility[];
  engaged: Facility[];
  noResponse: Facility[];
  declined: Facility[];
  invalid: Facility[];
};

export const ListView = ({ location, onLocationCountsChange }: ListViewProps) => {
  const { facilities, isLoading, refetch } = useFacilities(location, onLocationCountsChange);
  const { handleCellChange, addNewRow } = useFacilityActions(refetch);

  const groupedFacilities: GroupedFacilities = facilities.reduce((acc, facility) => {
    switch (facility.status) {
      case "Active":
        acc.active.push(facility);
        break;
      case "Engaged":
        acc.engaged.push(facility);
        break;
      case "No response":
        acc.noResponse.push(facility);
        break;
      case "Declined":
        acc.declined.push(facility);
        break;
      case "Invalid":
        acc.invalid.push(facility);
        break;
    }
    return acc;
  }, { active: [], engaged: [], noResponse: [], declined: [], invalid: [] } as GroupedFacilities);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <ListHeader 
        location={location} 
        onAddFacility={() => addNewRow(location)} 
      />
      
      <div className="space-y-8">
        <FacilityGroup 
          facilities={groupedFacilities.active}
          title="Active Partners"
          titleColor="text-success"
          onSave={handleCellChange}
          onDelete={refetch}
        />
        <FacilityGroup 
          facilities={groupedFacilities.engaged}
          title="Engaged Prospects"
          titleColor="text-[#0FA0CE]"
          onSave={handleCellChange}
          onDelete={refetch}
        />
        <FacilityGroup 
          facilities={groupedFacilities.noResponse}
          title="No Response"
          titleColor="text-black"
          onSave={handleCellChange}
          onDelete={refetch}
        />
        <FacilityGroup 
          facilities={groupedFacilities.declined}
          title="Declined"
          titleColor="text-[#ea384c]"
          onSave={handleCellChange}
          onDelete={refetch}
        />
        <FacilityGroup 
          facilities={groupedFacilities.invalid}
          title="Invalid"
          titleColor="text-gray-500"
          onSave={handleCellChange}
          onDelete={refetch}
        />
      </div>
    </div>
  );
};