import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { FacilityImportData } from "../validation/importValidation";
import { validateImportData } from "../validation/importValidation";

export const useImportData = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<FacilityImportData[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const processData = (text: string) => {
    console.log('Raw CSV text:', text);
    setRawData(text);
    if (!text.trim()) {
      setPreview([]);
      setErrors({});
      return;
    }

    try {
      const rows = text.trim().split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      
      console.log('Parsed CSV rows:', rows);
      
      if (rows.length < 2) {
        setErrors({ [-1]: ["File must contain at least one data row"] });
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase());
      console.log('CSV headers:', headers);
      
      const data = rows.slice(1).map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          if (header === 'buying_price' || header === 'selling_price') {
            // Convert price strings to numbers or null
            const value = row[i] ? parseFloat(row[i]) : null;
            obj[header] = isNaN(value) ? null : value;
          } else {
            obj[header] = row[i] || null;
          }
        });
        return obj;
      });

      console.log('Processed data objects:', data);
      
      // Validate the data
      const { validData, errors: validationErrors } = validateImportData(data);
      setPreview(validData);
      setErrors(validationErrors);
      
    } catch (error) {
      console.error('Parse error:', error);
      setErrors({ [-1]: ["Error parsing file. Please check your data format."] });
      setPreview([]);
    }
  };

  const resetData = () => {
    setRawData("");
    setPreview([]);
    setErrors({});
  };

  return {
    rawData,
    preview,
    errors,
    processData,
    resetData
  };
};