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

  // Fetch ports data
  const { data: ports, isLoading: isLoadingPorts } = useQuery({
    queryKey: ["ports"],
    queryFn: async () => {
      console.log("Fetching ports...");
      const { data, error } = await supabase
        .from("ports")
        .select("*")
        .order('name');
      
      if (error) {
        console.error("Error fetching ports:", error);
        throw error;
      }
      console.log("Fetched ports:", data);
      return data as Port[];
    },
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

  // Filter ports by type
  const originPorts = ports?.filter(port => port.type === 'ORIGIN') || [];
  const destinationPorts = ports?.filter(port => port.type === 'DESTINATION') || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ScheduleHeader
          unreadNotifications={unreadNotifications}
          onRefresh={handleRefresh}
          onAddSchedule={() => setIsDialogOpen(true)}
          isRefreshing={isRefreshing}
        />

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