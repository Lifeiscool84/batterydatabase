import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/pages/Customers";
import { FacilityTableHeader } from "./list/FacilityTableHeader";
import { EditableCell } from "./list/EditableCell";

interface ListViewProps {
  location: Location;
}

const VALID_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Engaged", label: "Engaged" },
  { value: "No response", label: "No response" },
  { value: "Declined", label: "Declined" }
];

const VALID_SIZES = [
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" }
];

type Facility = {
  id: string;
  name: string;
  status: typeof VALID_STATUSES[number]["value"];
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  size: typeof VALID_SIZES[number]["value"];
  general_remarks?: string;
  internal_notes?: string;
};

export const ListView = ({ location }: ListViewProps) => {
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
      status: "No response" as const,
      address: "",
      phone: "",
      size: "Medium" as const,
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
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="overflow-x-auto">
            <Table>
              <FacilityTableHeader />
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>
                      <EditableCell
                        value={facility.name}
                        field="name"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.status}
                        field="status"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                        type="select"
                        options={VALID_STATUSES}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.address}
                        field="address"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.phone}
                        field="phone"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.size}
                        field="size"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                        type="select"
                        options={VALID_SIZES}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.email}
                        field="email"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.website}
                        field="website"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.buying_price}
                        field="buying_price"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.selling_price}
                        field="selling_price"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.general_remarks}
                        field="general_remarks"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={facility.internal_notes}
                        field="internal_notes"
                        facilityId={facility.id}
                        onSave={handleCellChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};