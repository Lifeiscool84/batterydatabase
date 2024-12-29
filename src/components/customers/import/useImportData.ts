import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { FacilityImportData } from "../validation/importValidation";

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
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase());
      console.log('CSV headers:', headers);
      
      const data = rows.slice(1).map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          obj[header] = row[i] || null;
        });
        return obj;
      });

      console.log('Processed data objects:', data);
      setPreview(data);
      setErrors({});
      
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