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

  useEffect(() => {
    fetchFacilities();
  }, [location]);

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Calculate location counts
      const counts: Record<Location, number> = {
        "Houston": 0,
        "New York/New Jersey": 0,
        "Seattle": 0,
        "Mobile": 0,
        "Los Angeles": 0
      };
      
      data.forEach(facility => {
        // Here you would need to add a location field to your facilities table
        // For now, we'll just count facilities in the current location
        if (location === location) {
          counts[location] = (counts[location] || 0) + 1;
        }
      });
      
      onLocationCountsChange(counts);
      setFacilities(data);
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