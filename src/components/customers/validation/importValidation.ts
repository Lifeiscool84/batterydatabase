import { z } from "zod";
import { VALID_STATUSES, VALID_SIZES } from "../constants";
import type { Database } from "@/integrations/supabase/types";

const validStatusValues = VALID_STATUSES.map(status => status.value);
const validSizeValues = VALID_SIZES.map(size => size.value);

type FacilityStatus = Database['public']['Enums']['facility_status'];
type FacilitySize = Database['public']['Enums']['facility_size'];

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  status: z.enum(validStatusValues as [string, ...string[]], {
    errorMap: () => ({ message: `Status must be one of: ${validStatusValues.join(', ')}` })
  }).transform((val): FacilityStatus => val as FacilityStatus),
  address: z.string().min(1, "Address is required"),
  phone: z.string(),
  size: z.enum(validSizeValues as [string, ...string[]], {
    errorMap: () => ({ message: `Size must be one of: ${validSizeValues.join(', ')}` })
  }).transform((val): FacilitySize => val as FacilitySize),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  buying_price: z.string()
    .transform(val => val ? parseFloat(val) : null)
    .pipe(z.number().nullable()),
  selling_price: z.string()
    .transform(val => val ? parseFloat(val) : null)
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

  // First, validate that we have the required columns
  const requiredColumns = ['name', 'status', 'address', 'phone', 'size'];
  const headers = Object.keys(data[0] || {}).map(h => h.toLowerCase());
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));

  if (missingColumns.length > 0) {
    errors[-1] = [`Missing required columns: ${missingColumns.join(', ')}`];
    return { validData, errors };
  }

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
      errors[index] = [`Row ${index + 1}: Invalid data format`];
    }
  });

  return { validData, errors };
};