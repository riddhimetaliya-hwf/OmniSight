
import React, { useState, useEffect } from "react";
import { useDashboards } from "./useDashboards";
import { useToast } from "@/components/ui/use-toast";
import { Widget, DashboardType } from "./types";
import {
  DashboardHeader,
  DashboardLoading,
  EmptyDashboard
} from "./components";
import SavedViewsSection from "./components/SavedViewsSection";
import DashboardActions from "./components/DashboardActions";
import DashboardContent from "./components/DashboardContent";
import { useSavedViews } from "./hooks/useSavedViews";
import { useShareDashboard } from "./hooks/useShareDashboard";
import DashboardTypeSelector from "./components/DashboardTypeSelector";

const DashboardBuilder: React.FC = () => {
  const { 
    dashboards, 
    currentDashboard, 
    isLoading, 
    setCurrentDashboard, 
    saveDashboard,
    duplicateDashboard,
    exportDashboard,
    updateDashboardFilters,
    deleteWidget,
    toggleWidgetFavorite,
    createWidget
  } = useDashboards();

  const [activeTab, setActiveTab] = useState("all");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dashboardType, setDashboardType] = useState<DashboardType>("general");
  const { toast } = useToast();

  const {
    showSavedViews,
    setShowSavedViews,
    handleSaveView,
    handleDeleteView,
    handleApplyView
  } = useSavedViews(currentDashboard, saveDashboard);

  const {
    showShareDialog,
    handleOpenShareDialog,
    handleShareDashboard
  } = useShareDashboard(currentDashboard, saveDashboard);

  const handleDashboardChange = (dashboardId: string) => {
    const selected = dashboards.find(d => d.id === dashboardId);
    if (selected) {
      setCurrentDashboard(selected);
      // Set dashboard type based on the selected dashboard
      if (selected.type) {
        setDashboardType(selected.type);
      }
    }
  };

  const handleUpdateDashboard = (updatedDashboard) => {
    saveDashboard(updatedDashboard);
  };

  const handleDashboardTypeChange = (type: DashboardType) => {
    setDashboardType(type);
    // Apply dashboard type filters or load specific dashboards
    if (currentDashboard) {
      const updatedDashboard = {
        ...currentDashboard,
        type: type
      };
      saveDashboard(updatedDashboard);
    }
  };

  const handleCreateWidget = () => {
    if (currentDashboard) {
      // Use the createWidget function from useDashboards
      // This will be implemented with the AddWidgetModal
      toast({
        title: "Add widget",
        description: "Opening widget selection panel",
      });
    }
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!currentDashboard) {
    return <EmptyDashboard onCreateDashboard={() => console.log('Create dashboard')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <DashboardHeader 
          currentDashboard={currentDashboard}
          dashboards={dashboards}
          onDashboardChange={handleDashboardChange}
        />
        <DashboardActions 
          showSavedViews={showSavedViews}
          setShowSavedViews={setShowSavedViews}
          showShareDialog={showShareDialog}
          currentDashboard={currentDashboard}
          onOpenShareDialog={handleOpenShareDialog}
          onShareDashboard={handleShareDashboard}
          isCustomizing={isCustomizing}
          setIsCustomizing={setIsCustomizing}
        />
      </div>

      <DashboardTypeSelector 
        currentType={dashboardType}
        onTypeChange={handleDashboardTypeChange}
      />

      <SavedViewsSection 
        showSavedViews={showSavedViews}
        currentDashboard={currentDashboard}
        onSaveView={handleSaveView}
        onDeleteView={handleDeleteView}
        onApplyView={handleApplyView}
      />

      <DashboardContent 
        dashboard={currentDashboard}
        dashboardType={dashboardType}
        onUpdateDashboard={handleUpdateDashboard}
        isCustomizing={isCustomizing}
        onCreateWidget={handleCreateWidget}
      />
    </div>
  );
};

export default DashboardBuilder;
