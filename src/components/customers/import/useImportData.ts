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
        if (errors[-1]) {
          // Show missing columns error
          toast({
            title: "Missing Required Columns",
            description: errors[-1][0],
            variant: "destructive",
          });
        } else {
          toast({
            title: "Validation Issues Found",
            description: `Found ${Object.keys(errors).length} rows with errors. Please review the errors below.`,
            variant: "destructive",
          });
        }
      } else if (validData.length > 0) {
        toast({
          title: "Data Validated Successfully",
          description: `${validData.length} records are ready to import`,
        });
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: "Error Parsing Data",
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