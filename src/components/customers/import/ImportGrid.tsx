import { Label } from "@/components/ui/label";

const HEADERS = [
  { label: 'Name', width: 'min-w-[200px]' },
  { label: 'Status', width: 'min-w-[120px]' },
  { label: 'Address', width: 'min-w-[300px]' },
  { label: 'Phone', width: 'min-w-[150px]' },
  { label: 'Size', width: 'min-w-[120px]' },
  { label: 'Email', width: 'min-w-[200px]' },
  { label: 'Website', width: 'min-w-[300px]' },
  { label: 'Buying Price', width: 'min-w-[150px]' },
  { label: 'Selling Price', width: 'min-w-[150px]' }
];

interface ImportGridProps {
  rawData: string;
  onDataChange: (value: string) => void;
  exampleData: string;
}

export const ImportGrid = ({ rawData, onDataChange, exampleData }: ImportGridProps) => {
  return (
    <div>
      <Label htmlFor="data">Paste your data here</Label>
      <div className="border rounded-md p-4 bg-white overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[repeat(9,minmax(120px,1fr))] gap-0.5 mb-2">
            {HEADERS.map((header, i) => (
              <div 
                key={i} 
                className={`p-2 font-semibold text-sm bg-gray-100 first:rounded-tl-md last:rounded-tr-md border-b border-gray-200 ${header.width}`}
              >
                {header.label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(9,minmax(120px,1fr))] gap-0.5">
            <textarea
              id="data"
              className="col-span-9 min-h-[200px] w-full font-mono text-sm 
                       focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500
                       bg-white p-2 border border-gray-200 rounded-md resize-none
                       placeholder:text-gray-400"
              placeholder={`Paste CSV data here...\n\nExample format:\n${exampleData}`}
              value={rawData}
              onChange={(e) => onDataChange(e.target.value)}
              style={{
                backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
                backgroundSize: 'calc(100% / 9) 2em',
                lineHeight: '2em',
                padding: '0.5em',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};