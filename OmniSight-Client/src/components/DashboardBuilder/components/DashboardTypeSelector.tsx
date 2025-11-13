
import React from "react";
import { DashboardType } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, DollarSign, Users, BarChart } from "lucide-react";

interface DashboardTypeSelectorProps {
  currentType: DashboardType;
  onTypeChange: (type: DashboardType) => void;
}

const DashboardTypeSelector: React.FC<DashboardTypeSelectorProps> = ({ 
  currentType, 
  onTypeChange 
}) => {
  return (
    <div className="bg-card rounded-lg p-2 border">
      <Tabs 
        value={currentType} 
        onValueChange={(value) => onTypeChange(value as DashboardType)} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Sales</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Finance</span>
          </TabsTrigger>
          <TabsTrigger value="hr" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">HR</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Operations</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardTypeSelector;
