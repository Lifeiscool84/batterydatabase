import { z } from "zod";
import { VALID_STATUSES, VALID_SIZES } from "../constants";
import type { Database } from "@/integrations/supabase/types";

const validStatusValues = VALID_STATUSES.map(status => status.value);
const validSizeValues = VALID_SIZES.map(size => size.value);

type FacilityStatus = Database['public']['Enums']['facility_status'];
type FacilitySize = Database['public']['Enums']['facility_size'];

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  status: z.enum(validStatusValues as [string, ...string[]], {
    errorMap: () => ({ message: `Status must be one of: ${validStatusValues.join(', ')}` })
  }).transform((val): FacilityStatus => val as FacilityStatus),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Phone must be in format (XXX) XXX-XXXX"),
  size: z.enum(validSizeValues as [string, ...string[]], {
    errorMap: () => ({ message: `Size must be one of: ${validSizeValues.join(', ')}` })
  }).transform((val): FacilitySize => val as FacilitySize),
  email: z.string().email("Invalid email format").optional().nullable(),
  website: z.string().regex(urlRegex, "Invalid website URL").optional().nullable(),
  buying_price: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().positive("Buying price must be positive").nullable()
  ),
  selling_price: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().positive("Selling price must be positive").nullable()
  ),
  last_contact: z.string().datetime("Invalid date format").optional().nullable(),
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
      // Process the data before validation
      const processedRow = {
        ...row,
        // Convert status to proper case to match enum values
        status: row.status ? 
          validStatusValues.find(v => v.toLowerCase() === row.status?.toLowerCase()) || row.status
          : null,
        // Convert size to proper case to match enum values
        size: row.size ?
          validSizeValues.find(v => v.toLowerCase() === row.size?.toLowerCase()) || row.size
          : null,
      };

      const result = facilityImportSchema.safeParse(processedRow);
      
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