import { z } from "zod";
import { VALID_STATUSES, VALID_SIZES } from "../constants";
import type { Database } from "@/integrations/supabase/types";

type FacilityStatus = Database['public']['Enums']['facility_status'];
type FacilitySize = Database['public']['Enums']['facility_size'];

const validStatusValues = VALID_STATUSES.map(status => status.value);
const validSizeValues = VALID_SIZES.map(size => size.value);

export const facilityImportSchema = z.object({
  name: z.string(),
  status: z.string()
    .transform(val => {
      const status = val.toLowerCase().trim();
      const matchedStatus = validStatusValues.find(
        s => s.toLowerCase() === status
      );
      return (matchedStatus || "Invalid") as FacilityStatus;
    }),
  address: z.string(),
  phone: z.string(),
  size: z.string()
    .transform(val => {
      const size = val.toLowerCase().trim();
      const matchedSize = validSizeValues.find(
        s => s.toLowerCase() === size
      );
      return (matchedSize || "Invalid") as FacilitySize;
    }),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  buying_price: z.string().nullable().optional(),
  selling_price: z.string().nullable().optional(),
  general_remarks: z.string().nullable().optional(),
  internal_notes: z.string().nullable().optional(),
  location: z.string().optional().default("Houston")
});

export type FacilityImportData = z.infer<typeof facilityImportSchema>;

export const validateImportData = (data: any[]): { 
  validData: FacilityImportData[], 
  errors: Record<number, string[]> 
} => {
  const validData: FacilityImportData[] = [];
  const errors: Record<number, string[]> = {};

  data.forEach((row, index) => {
    try {
      const result = facilityImportSchema.safeParse(row);
      
      if (!result.success) {
        errors[index] = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
      } else {
        validData.push(result.data);
      }
    } catch (error) {
      errors[index] = [`Row ${index + 1}: ${error.message}`];
    }
  });

  return { validData, errors };
};