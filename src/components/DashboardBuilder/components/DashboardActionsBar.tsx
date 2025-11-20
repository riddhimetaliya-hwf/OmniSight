
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  File, 
  FilePlus, 
  Plus, 
  Star, 
  StarOff
} from "lucide-react";
import { Dashboard } from "../types";

interface DashboardActionsBarProps {
  currentDashboard: Dashboard;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDuplicate: (dashboardId: string, name: string) => void;
  onExport: (dashboardId: string, format: 'pdf' | 'excel' | 'image') => void;
}

const DashboardActionsBar: React.FC<DashboardActionsBarProps> = ({
  currentDashboard,
  activeTab,
  setActiveTab,
  onDuplicate,
  onExport
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All Widgets</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 text-xs"
          onClick={() => console.log('Add widget')}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Widget
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 text-xs"
          onClick={() => 
            currentDashboard.favorite 
              ? console.log('Remove from favorites') 
              : console.log('Add to favorites')
          }
        >
          {currentDashboard.favorite ? (
            <>
              <StarOff className="h-3.5 w-3.5 mr-1" />
              Unfavorite
            </>
          ) : (
            <>
              <Star className="h-3.5 w-3.5 mr-1" />
              Favorite
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 text-xs"
          onClick={() => onDuplicate(currentDashboard.id, `${currentDashboard.name} (Copy)`)}
        >
          <FilePlus className="h-3.5 w-3.5 mr-1" />
          Duplicate
        </Button>
        
        <Select 
          onValueChange={(format) => onExport(currentDashboard.id, format as 'pdf' | 'excel' | 'image')}
        >
          <SelectTrigger className="h-9 text-xs w-auto">
            <div className="flex items-center">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">
              <div className="flex items-center">
                <File className="h-3.5 w-3.5 mr-2" />
                PDF
              </div>
            </SelectItem>
            <SelectItem value="excel">
              <div className="flex items-center">
                <File className="h-3.5 w-3.5 mr-2" />
                Excel
              </div>
            </SelectItem>
            <SelectItem value="image">
              <div className="flex items-center">
                <File className="h-3.5 w-3.5 mr-2" />
                Image
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardActionsBar;
