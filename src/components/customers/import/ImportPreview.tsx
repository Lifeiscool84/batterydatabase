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
    <div className="space-y-4">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors Found</AlertTitle>
          <AlertDescription>
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
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="border rounded-md">
          <ScrollArea className="h-[300px]"> {/* Fixed height scroll area */}
            <div className="w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-100 z-10">
                  <TableRow>
                    <TableHead className="font-semibold w-[60px]">Row</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Name</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Address</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Phone</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Size</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Email</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Website</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Buying Price</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Selling Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className={errors[index] ? "bg-red-50" : "hover:bg-gray-50"}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{row.name}</TableCell>
                      <TableCell className="truncate max-w-[100px]">{row.status}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{row.address}</TableCell>
                      <TableCell className="truncate max-w-[120px]">{row.phone}</TableCell>
                      <TableCell className="truncate max-w-[80px]">{row.size}</TableCell>
                      <TableCell className="truncate max-w-[180px]">{row.email}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{row.website}</TableCell>
                      <TableCell className="truncate max-w-[120px]">{row.buying_price}</TableCell>
                      <TableCell className="truncate max-w-[120px]">{row.selling_price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};