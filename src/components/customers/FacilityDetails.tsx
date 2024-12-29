import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FacilityDetailsProps {
  facilityId: string;
  notes: string;
}

export const FacilityDetails = ({
  facilityId,
  notes
}: FacilityDetailsProps) => {
  useEffect(() => {
    const fetchFacilityDetails = async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('general_remarks, internal_notes')
        .eq('id', facilityId)
        .single();

      if (error) {
        console.error('Error fetching facility details:', error);
      } else {
        console.log('Facility details:', data);
      }
    };

    fetchFacilityDetails();
  }, [facilityId]);

  return (
    <div className="p-4 space-y-4 bg-muted/30 rounded-md">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            General Remarks
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Internal Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="prose prose-sm max-w-none">
              {notes || "No general remarks available."}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="prose prose-sm max-w-none">
              {notes || "No internal notes available."}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};