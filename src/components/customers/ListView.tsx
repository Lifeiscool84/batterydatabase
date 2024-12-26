import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/pages/Customers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FacilityNotes } from "./FacilityNotes";

interface ListViewProps {
  location: Location;
}

const VALID_STATUSES = ["Active", "Engaged", "No response", "Declined"] as const;
const VALID_SIZES = ["Small", "Medium", "Large"] as const;

type Facility = {
  id: string;
  name: string;
  status: typeof VALID_STATUSES[number];
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  size: typeof VALID_SIZES[number];
  notes?: string;
};

export const ListView = ({ location }: ListViewProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{id: string, field: keyof Facility} | null>(null);
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

  const handleCellClick = (id: string, field: keyof Facility) => {
    setEditingCell({ id, field });
  };

  const handleCellChange = async (id: string, field: keyof Facility, value: any) => {
    try {
      if (field === 'buying_price') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          throw new Error('Price must be a valid number');
        }
        value = numValue;
      }

      const { error } = await supabase
        .from('facilities')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setFacilities(facilities.map(facility => 
        facility.id === id ? { ...facility, [field]: value } : facility
      ));

      // Only show toast for significant changes, not status updates
      if (field !== 'status') {
        toast({
          title: "Updated successfully",
          description: `Updated ${field} for ${facilities.find(f => f.id === id)?.name}`,
        });
      }
    } catch (error) {
      console.error('Error updating facility:', error);
      toast({
        title: "Error updating facility",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setEditingCell(null);
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

  const renderEditableCell = (facility: Facility, field: keyof Facility) => {
    const isEditing = editingCell?.id === facility.id && editingCell?.field === field;

    if (!isEditing) {
      if (field === 'buying_price') {
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2"
            onClick={() => handleCellClick(facility.id, field)}
          >
            {facility[field] ? `$${facility[field]}/lb` : ''}
          </div>
        );
      }
      
      return (
        <div 
          className="cursor-pointer hover:bg-muted/50 p-2"
          onClick={() => handleCellClick(facility.id, field)}
        >
          {facility[field]?.toString() || ''}
        </div>
      );
    }

    if (field === 'status') {
      return (
        <Select
          defaultValue={facility[field]}
          onValueChange={(value) => handleCellChange(facility.id, field, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VALID_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field === 'size') {
      return (
        <Select
          defaultValue={facility[field]}
          onValueChange={(value) => handleCellChange(facility.id, field, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VALID_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field === 'notes') {
      return (
        <Input
          autoFocus
          className="min-w-[200px]"
          defaultValue={facility[field]?.toString() || ''}
          onBlur={(e) => handleCellChange(facility.id, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellChange(facility.id, field, e.currentTarget.value);
            }
          }}
        />
      );
    }

    return (
      <Input
        autoFocus
        defaultValue={facility[field]?.toString() || ''}
        onBlur={(e) => handleCellChange(facility.id, field, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCellChange(facility.id, field, e.currentTarget.value);
          }
        }}
      />
    );
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

      <ScrollArea className="h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Buying Price ($/lb)</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead className="min-w-[200px]">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.id}>
                {(['name', 'status', 'address', 'phone', 'size', 'email', 'website', 'buying_price', 'selling_price', 'notes'] as const).map((field) => (
                  <TableCell key={`${facility.id}-${field}`}>
                    {renderEditableCell(facility, field)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};