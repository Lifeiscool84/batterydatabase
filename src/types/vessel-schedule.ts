import { Database } from "@/integrations/supabase/types";
import { Port } from "./port";

export type VesselSchedule = {
  id: string;
  vessel_name: string;
  carrier: Database["public"]["Enums"]["shipping_line"];
  departure_date: string;
  arrival_date: string;
  doc_cutoff_date: string;
  hazmat_doc_cutoff_date: string;
  cargo_cutoff_date: string;
  hazmat_cargo_cutoff_date: string;
  source: string;
  origin_port: Port;
  destination_port: Port;
};