import { TableRow } from "@/components/ui/table";
import { FacilityCell } from "./FacilityCell";
import { VALID_STATUSES, VALID_SIZES, DbStatus, Size } from "../constants";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FacilityRowProps {
  facility: {
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
  onSave: (id: string, field: string, value: any) => void;
  onDelete?: () => void;
}

export const FacilityRow = ({ facility, onSave, onDelete }: FacilityRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facility.id);

      if (error) throw error;

      toast({
        title: "Facility deleted",
        description: `${facility.name} has been removed`,
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: "Error deleting facility",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <TableRow>
        <FacilityCell
          value={facility.name}
          field="name"
          facilityId={facility.id}
          onSave={onSave}
        />
        <FacilityCell
          value={facility.status}
          field="status"
          facilityId={facility.id}
          onSave={onSave}
          type="select"
          options={VALID_STATUSES}
        />
        <FacilityCell
          value={facility.address}
          field="address"
          facilityId={facility.id}
          onSave={onSave}
        />
        <FacilityCell
          value={facility.phone}
          field="phone"
          facilityId={facility.id}
          onSave={onSave}
        />
        <FacilityCell
          value={facility.size}
          field="size"
          facilityId={facility.id}
          onSave={onSave}
          type="select"
          options={VALID_SIZES}
        />
        <FacilityCell
          value={facility.email}
          field="email"
          facilityId={facility.id}
          onSave={onSave}
        />
        <FacilityCell
          value={facility.website}
          field="website"
          facilityId={facility.id}
          onSave={onSave}
        />
        <FacilityCell
          value={facility.buying_price}
          field="buying_price"
          facilityId={facility.id}
          onSave={onSave}
          type="number"
        />
        <FacilityCell
          value={facility.selling_price}
          field="selling_price"
          facilityId={facility.id}
          onSave={onSave}
          type="number"
        />
        <FacilityCell
          value={facility.general_remarks}
          field="general_remarks"
          facilityId={facility.id}
          onSave={onSave}
          className="min-w-[200px]"
        />
        <FacilityCell
          value={facility.internal_notes}
          field="internal_notes"
          facilityId={facility.id}
          onSave={onSave}
          className="min-w-[200px]"
        />
        <td className="p-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {facility.name} and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};