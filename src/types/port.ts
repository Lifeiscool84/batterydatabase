import { Database } from "@/integrations/supabase/types";

export type Port = {
  id: string;
  name: string;
  code: string;
  country: string;
  type: Database["public"]["Enums"]["port_type"];
  created_at?: string | null;
  updated_at?: string | null;
};