import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateImportData, type FacilityImportData } from "../validation/importValidation";

export const useImportData = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<FacilityImportData[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const processData = (text: string) => {
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
      
      if (rows.length < 2) {
        setErrors({ [-1]: ["Please include a header row and at least one data row"] });
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase());
      const data = rows.slice(1).map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          const value = row[i];
          if (value === undefined || value === '') return;
          obj[header] = value;
        });
        return obj;
      });

      const { validData, errors: validationErrors } = validateImportData(data);
      setPreview(validData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        if (validationErrors[-1]) {
          // Missing columns error
          setErrors(validationErrors);
        } else {
          setErrors(validationErrors);
        }
      } else if (validData.length > 0) {
        setErrors({});
      }
    } catch (error) {
      console.error('Parse error:', error);
      setErrors({ [-1]: ["Error parsing file. Please check your data format."] });
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