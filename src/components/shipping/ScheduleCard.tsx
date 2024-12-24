import { format } from "date-fns";
import { VesselSchedule } from "@/types/vessel-schedule";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ScheduleCardProps {
  schedule: VesselSchedule;
  onEdit: (schedule: VesselSchedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleCard = ({ schedule, onEdit, onDelete }: ScheduleCardProps) => {
  return (
    <div className="border rounded p-4 mb-4 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{schedule.vessel_name}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(schedule)}
            className="p-2"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(schedule.id)}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {schedule.carrier}
          </span>
        </div>
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
  );
};