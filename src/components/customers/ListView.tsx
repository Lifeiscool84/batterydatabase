import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/pages/Customers";
import { FacilityTableHeader } from "./list/FacilityTableHeader";
import { FacilityRow } from "./list/FacilityRow";
import { DbStatus, Size } from "./constants";

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

export const ListView = ({ location, onLocationCountsChange }: ListViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFacilities = async () => {
    try {
      // First, fetch all facilities to calculate counts
      const { data: allFacilities, error: countError } = await supabase
        .from('facilities')
        .select('location');

      if (countError) throw countError;

      // Calculate counts for each location
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

      // Then fetch facilities for the selected location
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
      location: location // Set the location for the new facility
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Facilities in {location}</h2>
        <Button onClick={addNewRow}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-[calc(100vh-300px)] w-full" type="scroll">
          <div className="min-w-[1200px] w-full">
            <Table>
              <FacilityTableHeader />
              <TableBody>
                {facilities.map((facility) => (
                  <FacilityRow
                    key={facility.id}
                    facility={facility}
                    onSave={handleCellChange}
                    onDelete={fetchFacilities}
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
