import { Label } from "@/components/ui/label";

const HEADERS = ['Name', 'Status', 'Address', 'Phone', 'Size', 'Email', 'Website', 'Buying Price', 'Selling Price'];

interface ImportGridProps {
  rawData: string;
  onDataChange: (value: string) => void;
  exampleData: string;
}

export const ImportGrid = ({ rawData, onDataChange, exampleData }: ImportGridProps) => {
  return (
    <div>
      <Label htmlFor="data">Paste your data here</Label>
      <div className="border rounded-md p-4 bg-white">
        <div className="grid grid-cols-[repeat(9,1fr)] gap-0.5 mb-2">
          {HEADERS.map((header, i) => (
            <div 
              key={i} 
              className="p-2 font-semibold text-sm bg-gray-100 first:rounded-tl-md last:rounded-tr-md border-b border-gray-200"
            >
              {header}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(9,1fr)] gap-0.5">
          <textarea
            id="data"
            className="col-span-9 min-h-[200px] w-full font-mono text-sm focus-visible:outline-none focus-visible:ring-0 bg-gray-50 p-2 border border-gray-100 rounded-md"
            placeholder={`Paste CSV data here...\n\nExample format:\n${exampleData}`}
            value={rawData}
            onChange={(e) => onDataChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};