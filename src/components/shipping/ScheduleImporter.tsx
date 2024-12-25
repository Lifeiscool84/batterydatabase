import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export const ScheduleImporter = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const processExcelData = (data: any[]) => {
    return data.map(row => ({
      vessel_name: row['Vessel Name'] || row['vessel_name'],
      carrier: 'ZIM',
      departure_date: new Date(row['Departure'] || row['departure_date']).toISOString(),
      arrival_date: new Date(row['Arrival'] || row['arrival_date']).toISOString(),
      doc_cutoff_date: new Date(row['Doc Cut-off'] || row['doc_cutoff_date']).toISOString(),
      hazmat_doc_cutoff_date: new Date(row['Doc Cut-off'] || row['hazmat_doc_cutoff_date']).toISOString(),
      cargo_cutoff_date: new Date(row['Cargo Cut-off'] || row['cargo_cutoff_date']).toISOString(),
      hazmat_cargo_cutoff_date: new Date(row['Cargo Cut-off'] || row['hazmat_cargo_cutoff_date']).toISOString(),
      source: 'EXCEL_IMPORT'
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      setProgress(25);

      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          setProgress(50);
          
          const processedData = processExcelData(jsonData);
          
          setProgress(75);

          const { error } = await supabase
            .from('vessel_schedules')
            .upsert(processedData, {
              onConflict: 'vessel_name,departure_date'
            });

          if (error) throw error;

          setProgress(100);
          toast({
            title: "Success",
            description: `Imported ${processedData.length} schedules successfully`,
            duration: 3000,
          });

        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process Excel file",
            variant: "destructive",
            duration: 3000,
          });
        }
      };

      reader.readAsBinaryString(file);

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Import ZIM Schedules</h3>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            <Button disabled={isLoading}>
              {isLoading ? "Importing..." : "Import Excel File"}
            </Button>
          </div>
        </div>

        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}
      </div>
    </Card>
  );
};