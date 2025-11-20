
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarSearch } from './sidebar/SidebarSearch';
import { BlocksTabContent } from './sidebar/BlocksTabContent';
import { TemplatesTabContent } from './sidebar/TemplatesTabContent';

interface WorkflowSidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
  className?: string;
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ width, onWidthChange, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('blocks');

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className={`border-r bg-muted/30 flex flex-col ${className}`}
        style={{ width: `${width}px` }}
      >
        <SidebarSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Tabs defaultValue="blocks" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-2">
            <TabsList className="w-full">
              <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            <TabsContent value="blocks" className="p-0 mt-0">
              <BlocksTabContent searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="templates" className="p-0 mt-0">
              <TemplatesTabContent />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DndProvider>
  );
};
