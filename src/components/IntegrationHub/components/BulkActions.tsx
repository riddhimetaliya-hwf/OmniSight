
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreHorizontal, 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  Trash2,
  CheckCircle,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkSync: () => void;
  onBulkPause: () => void;
  onBulkConfigure: () => void;
  onBulkDelete: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkSync,
  onBulkPause,
  onBulkConfigure,
  onBulkDelete
}) => {
  const [isVisible, setIsVisible] = useState(selectedItems.length > 0);

  React.useEffect(() => {
    setIsVisible(selectedItems.length > 0);
  }, [selectedItems.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <Checkbox
          checked={selectedItems.length === totalItems}
          onCheckedChange={() => {
            if (selectedItems.length === totalItems) {
              onClearSelection();
            } else {
              onSelectAll();
            }
          }}
        />
        
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {selectedItems.length} selected
        </Badge>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onBulkSync}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onBulkPause}>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBulkConfigure}>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onBulkDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
