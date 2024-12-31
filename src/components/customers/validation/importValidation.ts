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
      const status = val.replace(/\s*\([^)]*\)/, '').trim();
      const matchedStatus = validStatusValues.find(
        s => s.toLowerCase() === status.toLowerCase()
      );
      return (matchedStatus || "Invalid") as FacilityStatus;
    }),
  address: z.string(),
  phone: z.string(),
  size: z.string()
    .transform(val => {
      const size = val.replace(/\s*\([^)]*\)/, '').trim();
      const matchedSize = validSizeValues.find(
        s => s.toLowerCase() === size.toLowerCase()
      );
      return (matchedSize || "Invalid") as FacilitySize;
    }),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  buying_price: z.string()
    .transform(val => {
      if (!val) return null;
      // Extract numbers from string, including decimals and negative signs
      const number = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(number) ? null : number;
    })
    .pipe(z.number().nullable()),
  selling_price: z.string()
    .transform(val => {
      if (!val) return null;
      // Extract numbers from string, including decimals and negative signs
      const number = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(number) ? null : number;
    })
    .pipe(z.number().nullable()),
  general_remarks: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
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