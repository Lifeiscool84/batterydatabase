import { z } from "zod";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const facilityImportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["Active", "Engaged", "No response", "Declined"]).default("No response"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Phone must be in format (XXX) XXX-XXXX"),
  size: z.enum(["Small", "Medium", "Large"]).default("Medium"),
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
        status: mapOldStatusToNew(row.status?.toLowerCase() || 'general'),
        size: row.size || 'Medium',
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

// Helper function to map old status values to new ones
const mapOldStatusToNew = (oldStatus: string): "Active" | "Engaged" | "No response" | "Declined" => {
  const statusMap: Record<string, "Active" | "Engaged" | "No response" | "Declined"> = {
    'active': 'Active',
    'engaged': 'Engaged',
    'past': 'No response',
    'general': 'No response'
  };
  return statusMap[oldStatus] || 'No response';
};