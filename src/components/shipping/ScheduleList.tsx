import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { VesselSchedule } from "@/types/vessel-schedule";

interface ScheduleListProps {
  schedules: VesselSchedule[];
  onEdit: (schedule: VesselSchedule) => void;
  onDelete: (id: string) => void;
}

export const ScheduleList = ({ schedules, onEdit, onDelete }: ScheduleListProps) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vessel Name</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Doc Cut-off</TableHead>
            <TableHead>Hazmat Doc Cut-off</TableHead>
            <TableHead>Cargo Cut-off</TableHead>
            <TableHead>Hazmat Cargo Cut-off</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.vessel_name}</TableCell>
              <TableCell>{schedule.carrier}</TableCell>
              <TableCell>{format(new Date(schedule.departure_date), "PPp")}</TableCell>
              <TableCell>{format(new Date(schedule.arrival_date), "PPp")}</TableCell>
              <TableCell>{format(new Date(schedule.doc_cutoff_date), "PPp")}</TableCell>
              <TableCell>{format(new Date(schedule.hazmat_doc_cutoff_date), "PPp")}</TableCell>
              <TableCell>{format(new Date(schedule.cargo_cutoff_date), "PPp")}</TableCell>
              <TableCell>{format(new Date(schedule.hazmat_cargo_cutoff_date), "PPp")}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(schedule)}
                  className="mr-2"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(schedule.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};