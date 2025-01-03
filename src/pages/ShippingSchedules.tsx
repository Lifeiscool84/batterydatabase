import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Port } from "@/types/port";
import { VesselSchedule } from "@/types/vessel-schedule";
import { ScheduleFilters } from "@/components/shipping/ScheduleFilters";
import { ScheduleTable } from "@/components/shipping/ScheduleTable";
import { ScheduleDialog } from "@/components/shipping/ScheduleDialog";
import { ScheduleHeader } from "@/components/shipping/ScheduleHeader";
import { ScheduleImporter } from "@/components/shipping/ScheduleImporter";
import { useSchedules } from "@/hooks/useSchedules";

const ShippingSchedules = () => {
  const { toast } = useToast();
  const [selectedOriginPort, setSelectedOriginPort] = useState<string>("");
  const [selectedDestinationPort, setSelectedDestinationPort] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<VesselSchedule | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch ports data with enhanced error handling
  const { data: ports, isLoading: isLoadingPorts, error: portsError } = useQuery({
    queryKey: ["ports"],
    queryFn: async () => {
      console.log("Fetching ports...");
      
      // Check if we have an active session
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        console.error("No active session found");
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to view ports"
        });
        throw new Error("No active session");
      }

      const { data, error } = await supabase
        .from("ports")
        .select("*")
        .order('name');
      
      if (error) {
        console.error("Error fetching ports:", error);
        toast({
          variant: "destructive",
          title: "Error fetching ports",
          description: error.message
        });
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("No ports found in the database");
        toast({
          variant: "default",
          title: "No ports available",
          description: "Please ensure ports are added to the database"
        });
        return [];
      }

      console.log("Fetched ports:", data);
      return data as Port[];
    },
    retry: 1,
    retryDelay: 1000,
  });

  const {
    schedules,
    refetch: refetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedules();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      const { data, error } = await supabase.functions.invoke('crawl-vessel-schedule', {
        body: { automated: false }
      });

      if (error) throw error;
      await refetchSchedules();
      
      toast({
        title: "Schedules refreshed",
        description: `Last updated: ${format(new Date(), "PPpp")}`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error refreshing schedules:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing schedules",
        description: "Please try again later",
        duration: 2000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleScheduleSubmit = (data: any) => {
    if (selectedSchedule) {
      updateSchedule.mutate({ ...data, id: selectedSchedule.id });
      setIsDialogOpen(false);
      setSelectedSchedule(undefined);
    } else {
      createSchedule.mutate(data);
      setIsDialogOpen(false);
    }
  };

  const handleEditSchedule = (schedule: VesselSchedule) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      deleteSchedule.mutate(id);
    }
  };

  // Filter ports by type with additional logging
  const originPorts = ports?.filter(port => {
    console.log("Filtering port:", port);
    return port.type === 'ORIGIN';
  }) || [];
  const destinationPorts = ports?.filter(port => port.type === 'DESTINATION') || [];

  console.log("Final originPorts:", originPorts);
  console.log("Final destinationPorts:", destinationPorts);

  if (portsError) {
    console.error("Ports error:", portsError);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ScheduleHeader
          unreadNotifications={unreadNotifications}
          onRefresh={handleRefresh}
          onAddSchedule={() => setIsDialogOpen(true)}
          isRefreshing={isRefreshing}
        />

        <ScheduleImporter />

        <ScheduleFilters
          originPorts={originPorts}
          destinationPorts={destinationPorts}
          selectedOriginPort={selectedOriginPort}
          selectedDestinationPort={selectedDestinationPort}
          selectedCarrier={selectedCarrier}
          dateRange={dateRange}
          onOriginPortChange={setSelectedOriginPort}
          onDestinationPortChange={setSelectedDestinationPort}
          onCarrierChange={setSelectedCarrier}
          onDateChange={setDateRange}
        />

        <div className="bg-white rounded-lg shadow p-4">
          <ScheduleTable
            schedules={schedules || []}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>

        <ScheduleDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedSchedule(undefined);
          }}
          onSubmit={handleScheduleSubmit}
          schedule={selectedSchedule}
          originPorts={originPorts}
          destinationPorts={destinationPorts}
        />
      </div>
    </div>
  );
};

export default ShippingSchedules;