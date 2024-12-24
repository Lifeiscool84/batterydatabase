import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VesselSchedule, CreateVesselScheduleDTO } from "@/types/vessel-schedule";
import { Port } from "@/types/port";

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVesselScheduleDTO) => void;
  schedule?: VesselSchedule;
  originPorts: Port[];
  destinationPorts: Port[];
}

export const ScheduleDialog = ({
  isOpen,
  onClose,
  onSubmit,
  schedule,
  originPorts,
  destinationPorts,
}: ScheduleDialogProps) => {
  const { register, handleSubmit, setValue } = useForm<CreateVesselScheduleDTO>({
    defaultValues: schedule ? {
      vessel_name: schedule.vessel_name,
      carrier: schedule.carrier,
      origin_port_id: schedule.origin_port_id,
      destination_port_id: schedule.destination_port_id,
      departure_date: schedule.departure_date,
      arrival_date: schedule.arrival_date,
      doc_cutoff_date: schedule.doc_cutoff_date,
      hazmat_doc_cutoff_date: schedule.hazmat_doc_cutoff_date,
      cargo_cutoff_date: schedule.cargo_cutoff_date,
      hazmat_cargo_cutoff_date: schedule.hazmat_cargo_cutoff_date,
      source: schedule.source || "MANUAL",
    } : {
      source: "MANUAL",
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{schedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vessel_name">Vessel Name</Label>
                <Input id="vessel_name" {...register("vessel_name")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Select
                  onValueChange={(value) => setValue("carrier", value as any)}
                  defaultValue={schedule?.carrier}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ZIM">ZIM</SelectItem>
                    <SelectItem value="HMM">HMM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="origin_port_id">Origin Port</Label>
                <Select
                  onValueChange={(value) => setValue("origin_port_id", value)}
                  defaultValue={schedule?.origin_port_id}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select origin port" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {originPorts.map((port) => (
                      <SelectItem key={port.id} value={port.id}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination_port_id">Destination Port</Label>
                <Select
                  onValueChange={(value) => setValue("destination_port_id", value)}
                  defaultValue={schedule?.destination_port_id}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select destination port" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {destinationPorts.map((port) => (
                      <SelectItem key={port.id} value={port.id}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="departure_date">Departure Date</Label>
                <Input
                  id="departure_date"
                  type="datetime-local"
                  {...register("departure_date")}
                  defaultValue={schedule?.departure_date ? format(new Date(schedule.departure_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Input
                  id="arrival_date"
                  type="datetime-local"
                  {...register("arrival_date")}
                  defaultValue={schedule?.arrival_date ? format(new Date(schedule.arrival_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doc_cutoff_date">Doc Cut-off Date</Label>
                <Input
                  id="doc_cutoff_date"
                  type="datetime-local"
                  {...register("doc_cutoff_date")}
                  defaultValue={schedule?.doc_cutoff_date ? format(new Date(schedule.doc_cutoff_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hazmat_doc_cutoff_date">Hazmat Doc Cut-off Date</Label>
                <Input
                  id="hazmat_doc_cutoff_date"
                  type="datetime-local"
                  {...register("hazmat_doc_cutoff_date")}
                  defaultValue={schedule?.hazmat_doc_cutoff_date ? format(new Date(schedule.hazmat_doc_cutoff_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cargo_cutoff_date">Cargo Cut-off Date</Label>
                <Input
                  id="cargo_cutoff_date"
                  type="datetime-local"
                  {...register("cargo_cutoff_date")}
                  defaultValue={schedule?.cargo_cutoff_date ? format(new Date(schedule.cargo_cutoff_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hazmat_cargo_cutoff_date">Hazmat Cargo Cut-off Date</Label>
                <Input
                  id="hazmat_cargo_cutoff_date"
                  type="datetime-local"
                  {...register("hazmat_cargo_cutoff_date")}
                  defaultValue={schedule?.hazmat_cargo_cutoff_date ? format(new Date(schedule.hazmat_cargo_cutoff_date), "yyyy-MM-dd'T'HH:mm") : undefined}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button type="submit">{schedule ? "Update" : "Add"} Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
