
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CleanDataColumn } from './types';

interface DataPreviewProps {
  columns?: CleanDataColumn[];
  data?: Record<string, any>[];
  before?: Record<string, any>[];
  after?: Record<string, any>[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ columns, data, before, after }) => {
  // If we have before/after data, show diff view
  if (before && after) {
    return (
      <ScrollArea className="h-[250px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Row</TableHead>
              {columns?.map((column) => (
                <TableHead key={column.id}>{column.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {before.map((beforeRow, rowIndex) => {
              const afterRow = after[rowIndex];
              return (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                  {columns?.map((column) => {
                    const beforeValue = beforeRow[column.name];
                    const afterValue = afterRow?.[column.name];
                    const hasChanged = beforeValue !== afterValue;
                    
                    return (
                      <TableCell key={column.id} className="relative">
                        {hasChanged ? (
                          <div className="flex flex-col gap-1">
                            <div className="line-through text-muted-foreground">
                              {beforeValue?.toString() || 'null'}
                            </div>
                            <div className="text-green-600 font-medium">
                              {afterValue?.toString() || 'null'}
                            </div>
                          </div>
                        ) : (
                          beforeValue?.toString() || 'null'
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  }
  
  // Show regular data preview
  return (
    <ScrollArea className="h-[250px] border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Row</TableHead>
            {columns?.map((column) => (
              <TableHead key={column.id}>
                <div className="flex flex-col">
                  <span>{column.name}</span>
                  <Badge variant="outline" className="mt-1 text-xs">{column.type}</Badge>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell className="font-medium">{rowIndex + 1}</TableCell>
              {columns?.map((column) => (
                <TableCell key={column.id}>
                  {row[column.name]?.toString() || 'null'}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!data?.length && (
            <TableRow>
              <TableCell colSpan={(columns?.length || 0) + 1} className="text-center py-6 text-muted-foreground">
                No data to preview
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default DataPreview;
