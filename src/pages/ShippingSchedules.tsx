import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { RefreshCw, Bell, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/layout/BackButton";
import { Port } from "@/types/port";
import { VesselSchedule, CreateVesselScheduleDTO } from "@/types/vessel-schedule";
import { ScheduleFilters } from "@/components/shipping/ScheduleFilters";
import { ScheduleTable } from "@/components/shipping/ScheduleTable";
import { ScheduleDialog } from "@/components/shipping/ScheduleDialog";

const ShippingSchedules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOriginPort, setSelectedOriginPort] = useState<string>("");
  const [selectedDestinationPort, setSelectedDestinationPort] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<VesselSchedule | undefined>();

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

  const { data: schedules, refetch: refetchSchedules } = useQuery({
    queryKey: ["vessel_schedules", selectedOriginPort, selectedDestinationPort, selectedCarrier, dateRange],
    queryFn: async () => {
      const query = supabase
        .from("vessel_schedules")
        .select(`
          *,
          origin_port:ports!vessel_schedules_origin_port_id_fkey(*),
          destination_port:ports!vessel_schedules_destination_port_id_fkey(*)
        `)
        .gte("departure_date", new Date().toISOString())
        .lte("departure_date", new Date(new Date().setDate(new Date().getDate() + 84)).toISOString());

      if (selectedOriginPort) {
        query.eq("origin_port_id", selectedOriginPort);
      }
      if (selectedDestinationPort) {
        query.eq("destination_port_id", selectedDestinationPort);
      }
      if (selectedCarrier) {
        query.eq("carrier", selectedCarrier);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VesselSchedule[];
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_notifications")
        .select("*")
        .eq("read", false);
      if (error) throw error;
      return data;
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (newSchedule: CreateVesselScheduleDTO) => {
      const { data, error } = await supabase
        .from("vessel_schedules")
        .insert([newSchedule])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vessel_schedules"] });
      toast({ title: "Schedule created successfully" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating schedule",
        description: error.message,
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: CreateVesselScheduleDTO & { id: string }) => {
      const { data, error } = await supabase
        .from("vessel_schedules")
        .update(schedule)
        .eq("id", schedule.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vessel_schedules"] });
      toast({ title: "Schedule updated successfully" });
      setIsDialogOpen(false);
      setSelectedSchedule(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating schedule",
        description: error.message,
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vessel_schedules")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vessel_schedules"] });
      toast({ title: "Schedule deleted successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting schedule",
        description: error.message,
      });
    },
  });

  const handleRefresh = async () => {
    try {
      await refetchSchedules();
      toast({
        title: "Schedules refreshed",
        description: `Last updated: ${format(new Date(), "PPpp")}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error refreshing schedules",
        description: "Please try again later",
      });
    }
  };

  const handleScheduleSubmit = (data: CreateVesselScheduleDTO) => {
    if (selectedSchedule) {
      updateScheduleMutation.mutate({ ...data, id: selectedSchedule.id });
    } else {
      createScheduleMutation.mutate(data);
    }
  };

  const handleEditSchedule = (schedule: VesselSchedule) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      deleteScheduleMutation.mutate(id);
    }
  };

  const originPorts = ports?.filter(port => port.type === "ORIGIN") || [];
  const destinationPorts = ports?.filter(port => port.type === "DESTINATION") || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-2xl font-semibold">Shipping Schedules</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="relative"
              onClick={() => {/* Implement notifications panel */}}
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </div>

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

        <Tabs defaultValue="vessel" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="vessel">Vessel Line Schedules</TabsTrigger>
            <TabsTrigger value="port">Port Schedules</TabsTrigger>
          </TabsList>
          <TabsContent value="vessel" className="bg-white rounded-lg shadow p-4">
            <ScheduleTable
              schedules={schedules?.filter(s => s.source === "VESSEL_LINE") || []}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
            />
          </TabsContent>
          <TabsContent value="port" className="bg-white rounded-lg shadow p-4">
            <ScheduleTable
              schedules={schedules?.filter(s => s.source === "PORT") || []}
              onEdit={handleEditSchedule}
              onDelete={handleDeleteSchedule}
            />
          </TabsContent>
        </Tabs>

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
