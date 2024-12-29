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
        toast({
          title: "Invalid data format",
          description: "Please include a header row and at least one data row",
          variant: "destructive",
        });
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

      const { validData, errors } = validateImportData(data);
      setPreview(validData);
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast({
          title: "Validation issues found",
          description: "Please review the errors below and correct the data",
          variant: "destructive",
        });
      } else if (validData.length > 0) {
        toast({
          title: "Data validated successfully",
          description: `${validData.length} records ready to import`,
        });
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: "Error parsing data",
        description: "Please check your data format and try again",
        variant: "destructive",
      });
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