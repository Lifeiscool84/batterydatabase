import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { FacilityImportData } from "../validation/importValidation";

interface ImportPreviewProps {
  data: FacilityImportData[];
  errors: Record<number, string[]>;
}

export const ImportPreview = ({ data, errors }: ImportPreviewProps) => {
  const totalErrors = Object.keys(errors).length;
  const hasErrors = totalErrors > 0;

  return (
    <div className="space-y-4 max-h-[60vh] flex flex-col">
      {hasErrors && (
        <Alert variant="destructive" className="flex-shrink-0">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors Found</AlertTitle>
          <AlertDescription>
            <ScrollArea className="h-[100px] w-full pr-4">
              <div className="space-y-2">
                {Object.entries(errors).map(([row, rowErrors]) => {
                  const rowNum = parseInt(row);
                  if (rowNum === -1) {
                    return (
                      <div key="global" className="border-b border-red-200 pb-2">
                        {rowErrors.map((error, index) => (
                          <p key={index} className="text-sm">{error}</p>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div key={row} className="border-b border-red-200 pb-2">
                      <p className="font-semibold">Row {rowNum + 1}:</p>
                      <ul className="list-disc pl-6 mt-1">
                        {rowErrors.map((error, index) => {
                          const fieldMatch = error.match(/^([^:]+):/);
                          const fieldName = fieldMatch ? fieldMatch[1] : 'Field';
                          const errorMessage = error.replace(/^[^:]+: /, '');
                          return (
                            <li key={index} className="text-sm">
                              <strong>{fieldName}:</strong> {errorMessage}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2 flex-1 min-h-0">
        <h3 className="text-lg font-medium flex-shrink-0">Preview</h3>
        <div className="border rounded-md flex-1 min-h-0">
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[60px]">Row</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[250px]">Address</TableHead>
                  <TableHead className="w-[150px]">Phone</TableHead>
                  <TableHead className="w-[100px]">Size</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[200px]">Website</TableHead>
                  <TableHead className="w-[120px]">Buying Price</TableHead>
                  <TableHead className="w-[120px]">Selling Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} className={errors[index] ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{row.name}</TableCell>
                    <TableCell className="truncate max-w-[120px]">{row.status}</TableCell>
                    <TableCell className="truncate max-w-[250px]">{row.address}</TableCell>
                    <TableCell className="truncate max-w-[150px]">{row.phone}</TableCell>
                    <TableCell className="truncate max-w-[100px]">{row.size}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{row.email}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{row.website}</TableCell>
                    <TableCell className="truncate max-w-[120px]">{row.buying_price}</TableCell>
                    <TableCell className="truncate max-w-[120px]">{row.selling_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};