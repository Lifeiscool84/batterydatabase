import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FacilityTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Address</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Size</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Website</TableHead>
        <TableHead>Buying Price ($/lb)</TableHead>
        <TableHead>Selling Price</TableHead>
        <TableHead className="min-w-[200px]">Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
};