import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/pages/Customers";
import { DbStatus, Size } from "./constants";
import { ListHeader } from "./list/ListHeader";
import { FacilityGroup } from "./list/FacilityGroup";

interface ListViewProps {
  location: Location;
  onLocationCountsChange: (counts: Record<Location, number>) => void;
}

type Facility = {
  id: string;
  name: string;
  status: DbStatus;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  size: Size;
  general_remarks?: string;
  internal_notes?: string;
};

type GroupedFacilities = {
  active: Facility[];
  engaged: Facility[];
  noResponse: Facility[];
  declined: Facility[];
};

export const ListView = ({ location, onLocationCountsChange }: ListViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFacilities = async () => {
    try {
      const { data: allFacilities, error: countError } = await supabase
        .from('facilities')
        .select('location');

      if (countError) throw countError;

      const counts: Record<Location, number> = {
        "Houston": 0,
        "New York/New Jersey": 0,
        "Seattle": 0,
        "Mobile": 0,
        "Los Angeles": 0
      };

      allFacilities?.forEach(facility => {
        const loc = facility.location as Location;
        if (counts[loc] !== undefined) {
          counts[loc]++;
        }
      });

      onLocationCountsChange(counts);

      const { data: locationFacilities, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('location', location)
        .order('name');

      if (error) throw error;
      
      setFacilities(locationFacilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error fetching facilities",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const handleCellChange = async (id: string, field: keyof Facility, value: any) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setFacilities(facilities.map(facility => 
        facility.id === id ? { ...facility, [field]: value } : facility
      ));
    } catch (error) {
      console.error('Error updating facility:', error);
      toast({
        title: "Error updating facility",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const addNewRow = async () => {
    const newFacility = {
      name: "New Facility",
      status: "No response" as DbStatus,
      address: "",
      phone: "",
      size: "Medium" as Size,
      location: location
    };

    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert([newFacility])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setFacilities([...facilities, data]);
        toast({
          title: "Added new facility",
          description: "You can now edit its details",
        });
      }
    } catch (error) {
      console.error('Error adding facility:', error);
      toast({
        title: "Error adding facility",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

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
    }
    return acc;
  }, { active: [], engaged: [], noResponse: [], declined: [] } as GroupedFacilities);

  return (
    <div className="space-y-4">
      <ListHeader location={location} onAddFacility={addNewRow} />
      
      <div className="space-y-8">
        <FacilityGroup 
          facilities={groupedFacilities.active}
          title="Active Partners"
          titleColor="text-success"
          onSave={handleCellChange}
          onDelete={fetchFacilities}
        />
        <FacilityGroup 
          facilities={groupedFacilities.engaged}
          title="Engaged Prospects"
          titleColor="text-[#0FA0CE]"
          onSave={handleCellChange}
          onDelete={fetchFacilities}
        />
        <FacilityGroup 
          facilities={groupedFacilities.noResponse}
          title="No Response"
          titleColor="text-black"
          onSave={handleCellChange}
          onDelete={fetchFacilities}
        />
        <FacilityGroup 
          facilities={groupedFacilities.declined}
          title="Declined"
          titleColor="text-[#ea384c]"
          onSave={handleCellChange}
          onDelete={fetchFacilities}
        />
      </div>
    </div>
  );
};