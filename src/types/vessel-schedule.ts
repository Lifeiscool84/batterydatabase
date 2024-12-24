import { Database } from "@/integrations/supabase/types";

export type VesselSchedule = {
  id: string;
  vessel_name: string;
  carrier: Database["public"]["Enums"]["shipping_line"];
  origin_port_id?: string;
  destination_port_id?: string;
  departure_date: string;
  arrival_date: string;
  doc_cutoff_date: string;
  hazmat_doc_cutoff_date: string;
  cargo_cutoff_date: string;
  hazmat_cargo_cutoff_date: string;
  source: string;
  created_at?: string;
  updated_at?: string;
  // Joined relations
  origin_port?: {
    id: string;
    name: string;
    code: string;
    country: string;
    type: Database["public"]["Enums"]["port_type"];
  };
  destination_port?: {
    id: string;
    name: string;
    code: string;
    country: string;
    type: Database["public"]["Enums"]["port_type"];
  };
};

export type CreateVesselScheduleDTO = Omit<VesselSchedule, 'id' | 'created_at' | 'updated_at' | 'origin_port' | 'destination_port'>;