import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

const HEADERS = [
  { label: 'Name', width: '180px' },
  { label: 'Status', width: '100px' },
  { label: 'Address', width: '250px' },
  { label: 'Phone', width: '130px' },
  { label: 'Size', width: '100px' },
  { label: 'Email', width: '180px' },
  { label: 'Website', width: '250px' },
  { label: 'Buying Price', width: '120px' },
  { label: 'Selling Price', width: '120px' }
];

interface ImportGridProps {
  rawData: string;
  onDataChange: (value: string) => void;
  exampleData: string;
}

export const ImportGrid = ({ rawData, onDataChange, exampleData }: ImportGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedCell, setFocusedCell] = useState<number>(-1);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    onDataChange(pastedData);
  };

  const handleCellFocus = (index: number) => {
    setFocusedCell(index);
  };

  // Convert raw data to grid format
  const rows = rawData
    ? rawData.split('\n').map(row => row.split(',').map(cell => cell.trim()))
    : [Array(HEADERS.length).fill('')];

  return (
    <div className="space-y-2">
      <Label htmlFor="data">Paste your data here</Label>
      <div className="border rounded-md bg-white overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Headers */}
          <div className="grid grid-cols-9 border-b" style={{ gridAutoColumns: 'minmax(min-content, 1fr)' }}>
            {HEADERS.map((header, i) => (
              <div
                key={i}
                className="p-2 font-semibold text-sm bg-gray-100 border-r last:border-r-0"
                style={{ width: header.width }}
              >
                {header.label}
              </div>
            ))}
          </div>

          {/* Grid for paste */}
          <div
            ref={gridRef}
            className="relative min-h-[300px] max-h-[400px] overflow-y-auto"
            onPaste={handlePaste}
            tabIndex={0}
          >
            <div className="grid grid-cols-9 bg-white">
              {rows.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                  const cellIndex = rowIndex * HEADERS.length + colIndex;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`border-b border-r last:border-r-0 p-2 text-sm font-mono
                                ${focusedCell === cellIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                ${!cell && 'text-gray-400'}`}
                      style={{ width: HEADERS[colIndex].width }}
                      onFocus={() => handleCellFocus(cellIndex)}
                      tabIndex={0}
                    >
                      {cell || (rowIndex === 0 && colIndex === 0 ? 'Click here and paste your Excel data' : '')}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {/* Example format */}
          <div className="p-2 text-sm text-gray-500 border-t">
            Example format:
            <pre className="mt-1 text-xs">{exampleData}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};