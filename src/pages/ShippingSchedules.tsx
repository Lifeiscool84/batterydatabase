import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Port } from "@/types/port";
import { VesselSchedule, CreateVesselScheduleDTO } from "@/types/vessel-schedule";
import { ScheduleFilters } from "@/components/shipping/ScheduleFilters";
import { ScheduleList } from "@/components/shipping/ScheduleList";
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

  const { data: ports } = useQuery({
    queryKey: ["ports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ports")
        .select("*");
      if (error) throw error;
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
      
      // Call the edge function to crawl schedules
      const { data, error } = await supabase.functions.invoke('crawl-vessel-schedule', {
        body: { automated: false }
      });

      if (error) throw error;

      // Refetch schedules from the database
      await refetchSchedules();
      
      toast({
        title: "Schedules refreshed",
        description: `Last updated: ${format(new Date(), "PPpp")}`,
      });
    } catch (error) {
      console.error('Error refreshing schedules:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing schedules",
        description: "Please try again later",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleScheduleSubmit = (data: CreateVesselScheduleDTO) => {
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

  const originPorts = ports?.filter(port => port.type === "ORIGIN") || [];
  const destinationPorts = ports?.filter(port => port.type === "DESTINATION") || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ScheduleHeader
          unreadNotifications={unreadNotifications}
          onRefresh={handleRefresh}
          onAddSchedule={() => setIsDialogOpen(true)}
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
          <ScheduleList
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