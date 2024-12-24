import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { Port } from "@/types/port";

interface ScheduleFiltersProps {
  originPorts: Port[];
  destinationPorts: Port[];
  selectedOriginPort: string;
  selectedDestinationPort: string;
  selectedCarrier: string;
  dateRange: Date | undefined;
  onOriginPortChange: (value: string) => void;
  onDestinationPortChange: (value: string) => void;
  onCarrierChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

export const ScheduleFilters = ({
  originPorts,
  destinationPorts,
  selectedOriginPort,
  selectedDestinationPort,
  selectedCarrier,
  dateRange,
  onOriginPortChange,
  onDestinationPortChange,
  onCarrierChange,
  onDateChange,
}: ScheduleFiltersProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Select value={selectedOriginPort} onValueChange={onOriginPortChange}>
        <SelectTrigger className="bg-white">
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

      <Select value={selectedDestinationPort} onValueChange={onDestinationPortChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Destination Port (Busan)" />
        </SelectTrigger>
        <SelectContent>
          {destinationPorts
            .filter(port => port.name.toLowerCase().includes('busan') || port.name.toLowerCase().includes('pusan'))
            .map((port) => (
              <SelectItem key={port.id} value={port.id}>
                {port.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select value={selectedCarrier} onValueChange={onCarrierChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Carrier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ZIM">ZIM</SelectItem>
          <SelectItem value="HMM">HMM</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? format(dateRange, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode="single"
            selected={dateRange}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};