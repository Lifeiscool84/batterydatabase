import { z } from "zod";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "engaged", "past", "general"]),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Phone must be in format (XXX) XXX-XXXX"),
  email: z.string().email().optional(),
  website: z.string().regex(urlRegex).optional(),
  buying_price: z.number().positive().optional(),
  selling_price: z.number().positive().optional(),
  last_contact: z.string().datetime().optional(),
  size: z.enum(["Small", "Medium", "Large"]),
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
      const validatedRow = facilityImportSchema.parse({
        ...row,
        // Ensure required fields are present and not undefined
        name: row.name || '',
        status: row.status || 'general',
        address: row.address || '',
        phone: row.phone || '',
        size: row.size || 'Medium',
      });
      validData.push(validatedRow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors[index] = error.errors.map(e => e.message);
      }
    }
  });

  return { validData, errors };
};