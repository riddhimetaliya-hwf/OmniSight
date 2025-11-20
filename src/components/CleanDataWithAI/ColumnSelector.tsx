
import React from 'react';
import { CheckCircle2, CircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CleanDataset } from './types';

interface ColumnSelectorProps {
  dataset: CleanDataset;
  selectedColumns: string[];
  onSelectColumns: (columns: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  dataset, 
  selectedColumns, 
  onSelectColumns 
}) => {
  const toggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      onSelectColumns(selectedColumns.filter(col => col !== columnName));
    } else {
      onSelectColumns([...selectedColumns, columnName]);
    }
  };

  const selectAll = () => {
    onSelectColumns(dataset.columns.map(col => col.name));
  };

  const deselectAll = () => {
    onSelectColumns([]);
  };

  return (
    <div className="border rounded-md h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm mb-3">Select columns to clean</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={selectAll} className="text-xs py-1 h-7">
            Select All
          </Button>
          <Button size="sm" variant="outline" onClick={deselectAll} className="text-xs py-1 h-7">
            Deselect All
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-1">
          {dataset.columns.map(column => (
            <div 
              key={column.id}
              className={`
                flex justify-between items-center p-2 rounded-md cursor-pointer
                ${selectedColumns.includes(column.name) ? 'bg-primary/10' : 'hover:bg-muted'}
              `}
              onClick={() => toggleColumn(column.name)}
            >
              <div className="flex items-center gap-2">
                {selectedColumns.includes(column.name) ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <CircleIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">{column.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">{column.type}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ColumnSelector;
