import { z } from "zod";
import { VALID_STATUSES, VALID_SIZES } from "../constants";
import type { Database } from "@/integrations/supabase/types";

const validStatusValues = VALID_STATUSES.map(status => status.value);
const validSizeValues = VALID_SIZES.map(size => size.value);

type FacilityStatus = Database['public']['Enums']['facility_status'];
type FacilitySize = Database['public']['Enums']['facility_size'];

// More lenient phone validation - accepts any string with 10 digits
const phoneRegex = /^\D*(\d\D*){10}$/;
// More lenient URL validation
const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  status: z.enum(validStatusValues as [string, ...string[]], {
    errorMap: () => ({ message: `Status must be one of: ${validStatusValues.join(', ')}` })
  }).transform((val): FacilityStatus => val as FacilityStatus),
  address: z.string().min(1, "Address is required"),
  phone: z.string()
    .regex(phoneRegex, "Phone must contain 10 digits")
    .transform(val => {
      // Format phone number to (XXX) XXX-XXXX
      const digits = val.replace(/\D/g, '');
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    }),
  size: z.enum(validSizeValues as [string, ...string[]], {
    errorMap: () => ({ message: `Size must be one of: ${validSizeValues.join(', ')}` })
  }).transform((val): FacilitySize => val as FacilitySize),
  email: z.string()
    .email("Invalid email format")
    .nullable()
    .optional(),
  website: z.string()
    .regex(urlRegex, "Invalid website URL")
    .transform(url => url.toLowerCase())
    .nullable()
    .optional(),
  buying_price: z.string()
    .transform(val => val ? parseFloat(val) : null)
    .pipe(z.number().positive("Buying price must be positive").nullable()),
  selling_price: z.string()
    .transform(val => val ? parseFloat(val) : null)
    .pipe(z.number().positive("Selling price must be positive").nullable()),
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