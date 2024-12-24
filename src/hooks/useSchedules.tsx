import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VesselSchedule, CreateVesselScheduleDTO } from "@/types/vessel-schedule";

export const useSchedules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, refetch } = useQuery({
    queryKey: ["vessel_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vessel_schedules")
        .select(`
          *,
          origin_port:ports!vessel_schedules_origin_port_id_fkey(*),
          destination_port:ports!vessel_schedules_destination_port_id_fkey(*)
        `)
        .gte("departure_date", new Date().toISOString())
        .lte("departure_date", new Date(new Date().setDate(new Date().getDate() + 84)).toISOString());

      if (error) throw error;
      return data as VesselSchedule[];
    },
  });

  const createSchedule = useMutation({
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating schedule",
        description: error.message,
      });
    },
  });

  const updateSchedule = useMutation({
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating schedule",
        description: error.message,
      });
    },
  });

  const deleteSchedule = useMutation({
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

  return {
    schedules,
    refetch,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};