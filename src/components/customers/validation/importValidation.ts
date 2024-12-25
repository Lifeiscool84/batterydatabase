import { z } from "zod";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "engaged", "past", "general"]).default("general"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Phone must be in format (XXX) XXX-XXXX"),
  size: z.enum(["Small", "Medium", "Large"]).default("Medium"),
  email: z.string().email().optional(),
  website: z.string().regex(urlRegex, "Invalid website URL").optional(),
  buying_price: z.number().positive().optional(),
  selling_price: z.number().positive().optional(),
  last_contact: z.string().datetime().optional(),
  general_remarks: z.string().optional(),
  internal_notes: z.string().optional(),
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
      // Ensure required fields have default values if not provided
      const processedRow = {
        ...row,
        status: row.status?.toLowerCase() || 'general',
        size: row.size || 'Medium',
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