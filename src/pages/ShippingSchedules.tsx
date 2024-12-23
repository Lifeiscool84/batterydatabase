import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw, AlertTriangle, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Port } from "@/types/port";
import { VesselSchedule } from "@/types/vessel-schedule";

const ShippingSchedules = () => {
  const { toast } = useToast();
  const [selectedOriginPort, setSelectedOriginPort] = useState<string>("");
  const [selectedDestinationPort, setSelectedDestinationPort] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

  useEffect(() => {
    if (notifications) {
      setUnreadNotifications(notifications.length);
    }
  }, [notifications]);

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

  const originPorts = ports?.filter(port => port.type === "ORIGIN") || [];
  const destinationPorts = ports?.filter(port => port.type === "DESTINATION") || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Shipping Schedules</h1>
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
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Select value={selectedOriginPort} onValueChange={setSelectedOriginPort}>
            <SelectTrigger>
              <SelectValue placeholder="Origin Port" />
            </SelectTrigger>
            <SelectContent>
              {originPorts.map((port) => (
                <SelectItem key={port.id} value={port.id}>
                  {port.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDestinationPort} onValueChange={setSelectedDestinationPort}>
            <SelectTrigger>
              <SelectValue placeholder="Destination Port" />
            </SelectTrigger>
            <SelectContent>
              {destinationPorts.map((port) => (
                <SelectItem key={port.id} value={port.id}>
                  {port.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
            <SelectTrigger>
              <SelectValue placeholder="Carrier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZIM">ZIM</SelectItem>
              <SelectItem value="HMM">HMM</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Vessel Line Schedules</h2>
            <ScrollArea className="h-[600px]">
              {schedules?.filter(s => s.source === "VESSEL_LINE").map((schedule) => (
                <div key={schedule.id} className="border rounded p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{schedule.vessel_name}</h3>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {schedule.carrier}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Departure</p>
                      <p>{format(new Date(schedule.departure_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Arrival</p>
                      <p>{format(new Date(schedule.arrival_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Doc Cut-off</p>
                      <p>{format(new Date(schedule.doc_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hazmat Doc Cut-off</p>
                      <p>{format(new Date(schedule.hazmat_doc_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cargo Cut-off</p>
                      <p>{format(new Date(schedule.cargo_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hazmat Cargo Cut-off</p>
                      <p>{format(new Date(schedule.hazmat_cargo_cutoff_date), "PPp")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Port Schedules</h2>
            <ScrollArea className="h-[600px]">
              {schedules?.filter(s => s.source === "PORT").map((schedule) => (
                <div key={schedule.id} className="border rounded p-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{schedule.vessel_name}</h3>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {schedule.carrier}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Departure</p>
                      <p>{format(new Date(schedule.departure_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Arrival</p>
                      <p>{format(new Date(schedule.arrival_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Doc Cut-off</p>
                      <p>{format(new Date(schedule.doc_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hazmat Doc Cut-off</p>
                      <p>{format(new Date(schedule.hazmat_doc_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cargo Cut-off</p>
                      <p>{format(new Date(schedule.cargo_cutoff_date), "PPp")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hazmat Cargo Cut-off</p>
                      <p>{format(new Date(schedule.hazmat_cargo_cutoff_date), "PPp")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingSchedules;
