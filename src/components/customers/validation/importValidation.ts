import { z } from "zod";
import { VALID_STATUSES, VALID_SIZES } from "../constants";
import type { Database } from "@/integrations/supabase/types";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Create arrays of valid values for validation
const validStatusValues = VALID_STATUSES.map(status => status.value);
const validSizeValues = VALID_SIZES.map(size => size.value);

type FacilityStatus = Database['public']['Enums']['facility_status'];
type FacilitySize = Database['public']['Enums']['facility_size'];

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(validStatusValues as [string, ...string[]], {
    errorMap: () => ({ message: `Status must be one of: ${validStatusValues.join(', ')}` })
  }).transform((val): FacilityStatus => val as FacilityStatus),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Phone must be in format (XXX) XXX-XXXX"),
  size: z.enum(validSizeValues as [string, ...string[]], {
    errorMap: () => ({ message: `Size must be one of: ${validSizeValues.join(', ')}` })
  }).transform((val): FacilitySize => val as FacilitySize),
  email: z.string().email().optional().nullable(),
  website: z.string().regex(urlRegex, "Invalid website URL").optional().nullable(),
  buying_price: z.number().positive().optional().nullable(),
  selling_price: z.number().positive().optional().nullable(),
  last_contact: z.string().datetime().optional().nullable(),
  general_remarks: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
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
      // Process the data before validation
      const processedRow = {
        ...row,
        // Convert status to proper case to match enum values
        status: row.status ? 
          validStatusValues.find(v => v.toLowerCase() === row.status?.toLowerCase()) || 'No response'
          : 'No response',
        // Convert size to proper case to match enum values
        size: row.size ?
          validSizeValues.find(v => v.toLowerCase() === row.size?.toLowerCase()) || 'Medium'
          : 'Medium',
        // Convert string numbers to actual numbers
        buying_price: row.buying_price ? Number(row.buying_price) : null,
        selling_price: row.selling_price ? Number(row.selling_price) : null,
      };

      const validatedRow = facilityImportSchema.parse(processedRow);
      validData.push(validatedRow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors[index] = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      }
    }
  });

  return { validData, errors };
};