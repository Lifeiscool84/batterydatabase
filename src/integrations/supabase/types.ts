export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      facilities: {
        Row: {
          address: string
          buying_price: number | null
          created_at: string | null
          email: string | null
          general_remarks: string | null
          id: string
          internal_notes: string | null
          last_contact: string | null
          location: string
          name: string
          phone: string
          selling_price: number | null
          size: Database["public"]["Enums"]["facility_size"]
          status: Database["public"]["Enums"]["facility_status"]
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          buying_price?: number | null
          created_at?: string | null
          email?: string | null
          general_remarks?: string | null
          id?: string
          internal_notes?: string | null
          last_contact?: string | null
          location?: string
          name: string
          phone: string
          selling_price?: number | null
          size: Database["public"]["Enums"]["facility_size"]
          status: Database["public"]["Enums"]["facility_status"]
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          buying_price?: number | null
          created_at?: string | null
          email?: string | null
          general_remarks?: string | null
          id?: string
          internal_notes?: string | null
          last_contact?: string | null
          location?: string
          name?: string
          phone?: string
          selling_price?: number | null
          size?: Database["public"]["Enums"]["facility_size"]
          status?: Database["public"]["Enums"]["facility_status"]
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      facility_capabilities: {
        Row: {
          capability: string
          created_at: string | null
          facility_id: string | null
          id: string
        }
        Insert: {
          capability: string
          created_at?: string | null
          facility_id?: string | null
          id?: string
        }
        Update: {
          capability?: string
          created_at?: string | null
          facility_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_capabilities_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_interactions: {
        Row: {
          created_at: string | null
          facility_id: string | null
          id: string
          notes: string
          type: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          notes: string
          type: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          facility_id?: string | null
          id?: string
          notes?: string
          type?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_interactions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_price_history: {
        Row: {
          buying_price: number | null
          created_at: string | null
          facility_id: string | null
          id: string
          selling_price: number | null
          updated_by: string
        }
        Insert: {
          buying_price?: number | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          selling_price?: number | null
          updated_by: string
        }
        Update: {
          buying_price?: number | null
          created_at?: string | null
          facility_id?: string | null
          id?: string
          selling_price?: number | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_price_history_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_status_history: {
        Row: {
          created_at: string | null
          facility_id: string | null
          from_status: Database["public"]["Enums"]["facility_status"]
          id: string
          reason: string
          to_status: Database["public"]["Enums"]["facility_status"]
          user_name: string
        }
        Insert: {
          created_at?: string | null
          facility_id?: string | null
          from_status: Database["public"]["Enums"]["facility_status"]
          id?: string
          reason: string
          to_status: Database["public"]["Enums"]["facility_status"]
          user_name: string
        }
        Update: {
          created_at?: string | null
          facility_id?: string | null
          from_status?: Database["public"]["Enums"]["facility_status"]
          id?: string
          reason?: string
          to_status?: Database["public"]["Enums"]["facility_status"]
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_status_history_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      ports: {
        Row: {
          code: string
          country: string
          created_at: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["port_type"]
          updated_at: string | null
        }
        Insert: {
          code: string
          country: string
          created_at?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["port_type"]
          updated_at?: string | null
        }
        Update: {
          code?: string
          country?: string
          created_at?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["port_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          vessel_schedule_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          vessel_schedule_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          vessel_schedule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_notifications_vessel_schedule_id_fkey"
            columns: ["vessel_schedule_id"]
            isOneToOne: false
            referencedRelation: "vessel_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      vessel_schedules: {
        Row: {
          arrival_date: string
          cargo_cutoff_date: string
          carrier: Database["public"]["Enums"]["shipping_line"]
          created_at: string | null
          departure_date: string
          destination_port_id: string | null
          doc_cutoff_date: string
          hazmat_cargo_cutoff_date: string
          hazmat_doc_cutoff_date: string
          id: string
          origin_port_id: string | null
          source: string
          updated_at: string | null
          vessel_name: string
        }
        Insert: {
          arrival_date: string
          cargo_cutoff_date: string
          carrier: Database["public"]["Enums"]["shipping_line"]
          created_at?: string | null
          departure_date: string
          destination_port_id?: string | null
          doc_cutoff_date: string
          hazmat_cargo_cutoff_date: string
          hazmat_doc_cutoff_date: string
          id?: string
          origin_port_id?: string | null
          source: string
          updated_at?: string | null
          vessel_name: string
        }
        Update: {
          arrival_date?: string
          cargo_cutoff_date?: string
          carrier?: Database["public"]["Enums"]["shipping_line"]
          created_at?: string | null
          departure_date?: string
          destination_port_id?: string | null
          doc_cutoff_date?: string
          hazmat_cargo_cutoff_date?: string
          hazmat_doc_cutoff_date?: string
          id?: string
          origin_port_id?: string | null
          source?: string
          updated_at?: string | null
          vessel_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vessel_schedules_destination_port_id_fkey"
            columns: ["destination_port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vessel_schedules_origin_port_id_fkey"
            columns: ["origin_port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      facility_size: "Small" | "Medium" | "Large" | "Invalid"
      facility_status: "Active" | "Engaged" | "No response" | "Declined"
      port_type: "ORIGIN" | "DESTINATION"
      shipping_line: "ZIM" | "HMM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
