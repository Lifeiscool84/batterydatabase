import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImportPreview {
  name: string;
  status: "active" | "engaged" | "past" | "general";
  address: string;
  phone: string;
  email?: string;
  website?: string;
  buying_price?: number;
  selling_price?: number;
  last_contact: string;
  size: "Small" | "Medium" | "Large";
  general_remarks?: string;
  internal_notes?: string;
}

const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email?: string) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateWebsite = (website?: string) => {
  if (!website) return true;
  try {
    new URL(website.startsWith('http') ? website : `https://${website}`);
    return true;
  } catch {
    return false;
  }
};

const validatePrice = (price?: number) => {
  if (!price) return true;
  return price > 0;
};

export const FacilityImporter = () => {
  const [rawData, setRawData] = useState("");
  const [preview, setPreview] = useState<ImportPreview[]>([]);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const { toast } = useToast();

  const handlePaste = (text: string) => {
    setRawData(text);
    try {
      const rows = text.trim().split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });
      validateData(data);
    } catch (error) {
      toast({
        title: "Error parsing data",
        description: "Please check your data format and try again",
        variant: "destructive",
      });
    }
  };

  const validateData = (data: any[]) => {
    const validatedData: ImportPreview[] = [];
    const newErrors: Record<number, string[]> = {};

    data.forEach((row, index) => {
      const rowErrors: string[] = [];
      
      // Required fields
      if (!row.name) rowErrors.push("Name is required");
      if (!row.address) rowErrors.push("Address is required");
      if (!row.phone) rowErrors.push("Phone is required");
      if (!row.status) rowErrors.push("Status is required");
      if (!row.size) rowErrors.push("Size is required");

      // Format validation
      if (row.phone && !validatePhoneNumber(row.phone)) {
        rowErrors.push("Invalid phone format. Use (XXX) XXX-XXXX");
      }
      if (row.email && !validateEmail(row.email)) {
        rowErrors.push("Invalid email format");
      }
      if (row.website && !validateWebsite(row.website)) {
        rowErrors.push("Invalid website format");
      }
      if (row.buying_price && !validatePrice(Number(row.buying_price))) {
        rowErrors.push("Invalid buying price");
      }
      if (row.selling_price && !validatePrice(Number(row.selling_price))) {
        rowErrors.push("Invalid selling price");
      }

      // Status validation
      if (!["active", "engaged", "past", "general"].includes(row.status)) {
        rowErrors.push("Invalid status");
      }

      // Size validation
      if (!["Small", "Medium", "Large"].includes(row.size)) {
        rowErrors.push("Invalid size");
      }

      if (rowErrors.length > 0) {
        newErrors[index] = rowErrors;
      }

      validatedData.push(row as ImportPreview);
    });

    setPreview(validatedData);
    setErrors(newErrors);
  };

  const handleImport = async () => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix all errors before importing",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const facility of preview) {
        const { error } = await supabase
          .from('facilities')
          .insert([facility]);

        if (error) throw error;
      }

      toast({
        title: "Import successful",
        description: `Imported ${preview.length} facilities`,
      });

      setRawData("");
      setPreview([]);
      setErrors({});
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing the data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Facilities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste">
          <TabsList>
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
            <TabsTrigger value="upload" disabled>Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste">
            <div className="space-y-4">
              <div>
                <Label htmlFor="data">Paste your data here</Label>
                <textarea
                  id="data"
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste CSV data here..."
                  value={rawData}
                  onChange={(e) => handlePaste(e.target.value)}
                />
              </div>

              {preview.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preview</h3>
                  <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.map((row, index) => (
                          <TableRow key={index} className={errors[index] ? "bg-red-50" : undefined}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>{row.size}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please fix the following errors:
                        <ul className="list-disc pl-4 mt-2">
                          {Object.entries(errors).map(([row, rowErrors]) => (
                            <li key={row}>
                              Row {parseInt(row) + 1}: {rowErrors.join(", ")}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport}
          disabled={preview.length === 0 || Object.keys(errors).length > 0}
        >
          Import Data
        </Button>
      </CardFooter>
    </Card>
  );
};