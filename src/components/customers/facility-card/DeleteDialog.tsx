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

interface DeleteDialogProps {
  facilityName: string;
  facilityId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}

export const DeleteDialog = ({ 
  facilityName, 
  facilityId, 
  open, 
  onOpenChange,
  onDelete 
}: DeleteDialogProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facilityId);

      if (error) throw error;

      toast({
        title: "Facility deleted",
        description: `${facilityName} has been removed`,
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
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {facilityName} and all associated data. This action cannot be undone.
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
  );
};