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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">Row</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Address</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Size</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Website</TableHead>
              <TableHead className="font-semibold">Buying Price</TableHead>
              <TableHead className="font-semibold">Selling Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className={errors[index] ? "bg-red-50" : "hover:bg-gray-50"}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.website}</TableCell>
                <TableCell>{row.buying_price}</TableCell>
                <TableCell>{row.selling_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {totalErrors > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors Found ({totalErrors} rows with errors)</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              {Object.entries(errors).map(([row, rowErrors]) => (
                <div key={row} className="border-b border-red-200 pb-2">
                  <p className="font-semibold">Row {parseInt(row) + 1}:</p>
                  <ul className="list-disc pl-6 mt-1">
                    {rowErrors.map((error, index) => {
                      // Extract the field name from the error message
                      const fieldMatch = error.match(/^([^:]+):/);
                      const fieldName = fieldMatch ? fieldMatch[1] : 'Field';
                      return (
                        <li key={index} className="text-sm">
                          <strong>{fieldName}:</strong> {error.replace(/^[^:]+: /, '')}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};