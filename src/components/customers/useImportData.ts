import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { FacilityImportData } from "./validation/importValidation";
import { validateImportData } from "./validation/importValidation";

export const useImportData = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<FacilityImportData[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const cleanHeaderName = (header: string): string => {
    // Remove everything in parentheses and any surrounding whitespace
    return header.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
  };

  const processData = (text: string) => {
    console.log('Raw CSV text:', text);
    setRawData(text);
    if (!text.trim()) {
      setPreview([]);
      setErrors({});
      return;
    }

    try {
      // Split into lines and handle quoted values properly
      const lines = text.trim().split('\n');
      const rows = lines.map(line => {
        const row: string[] = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        row.push(currentValue.trim());
        return row;
      });
      
      console.log('Parsed CSV rows:', rows);
      
      if (rows.length < 2) {
        setErrors({ [-1]: ["File must contain at least one data row"] });
        return;
      }

      // Clean headers first
      const headers = rows[0].map(cleanHeaderName);
      console.log('Cleaned CSV headers:', headers);
      
      // Map data using cleaned headers
      const data = rows.slice(1).map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          // Remove any quotes from the value
          const value = row[i]?.replace(/^"|"$/g, '').trim() || null;
          obj[header] = value;
        });
        return obj;
      });

      console.log('Processed data objects before validation:', data);
      
      // Validate the data
      const { validData, errors: validationErrors } = validateImportData(data);
      console.log('Validated data:', validData);
      console.log('Validation errors:', validationErrors);
      
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