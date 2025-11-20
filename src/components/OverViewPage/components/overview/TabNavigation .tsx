import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, FileText, Activity } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full max-w-sm grid-cols-3 h-10 bg-muted/50">
        <TabsTrigger
          value="history"
          className="gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <History className="w-4 h-4" />
          History
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          className="gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Logs
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Activity className="w-4 h-4" />
          Activity
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
