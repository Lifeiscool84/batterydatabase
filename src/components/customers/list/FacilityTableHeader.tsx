import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FacilityTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[150px]">Name</TableHead>
        <TableHead className="min-w-[150px]">Status</TableHead>
        <TableHead className="min-w-[200px]">Address</TableHead>
        <TableHead className="min-w-[150px]">Phone</TableHead>
        <TableHead className="min-w-[100px]">Size</TableHead>
        <TableHead className="min-w-[200px]">Email</TableHead>
        <TableHead className="min-w-[200px]">Website</TableHead>
        <TableHead className="min-w-[150px]">Buying Price</TableHead>
        <TableHead className="min-w-[150px]">Selling Price</TableHead>
        <TableHead className="min-w-[200px]">General Remarks</TableHead>
        <TableHead className="min-w-[200px]">Internal Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
};