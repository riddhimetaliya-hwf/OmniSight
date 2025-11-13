
import { useState } from "react";
import { Dashboard, SavedView, DashboardFilters } from "../types";
import { v4 as uuidv4 } from "uuid";

export const useSavedViews = (
  currentDashboard: Dashboard | null,
  saveDashboard: (dashboard: Dashboard) => void
) => {
  const [showSavedViews, setShowSavedViews] = useState(false);

  const handleSaveView = (name: string, description?: string) => {
    if (!currentDashboard) return;

    const newView: SavedView = {
      id: uuidv4(),
      name,
      description,
      filters: currentDashboard.filters || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedDashboard = {
      ...currentDashboard,
      savedViews: [...(currentDashboard.savedViews || []), newView]
    };

    saveDashboard(updatedDashboard);
  };

  const handleDeleteView = (viewId: string) => {
    if (!currentDashboard || !currentDashboard.savedViews) return;

    const updatedViews = currentDashboard.savedViews.filter(
      (view) => view.id !== viewId
    );

    const updatedDashboard = {
      ...currentDashboard,
      savedViews: updatedViews
    };

    saveDashboard(updatedDashboard);
  };

  const handleApplyView = (viewId: string) => {
    if (!currentDashboard || !currentDashboard.savedViews) return;

    const selectedView = currentDashboard.savedViews.find(
      (view) => view.id === viewId
    );

    if (!selectedView) return;

    const updatedDashboard = {
      ...currentDashboard,
      filters: selectedView.filters
    };

    saveDashboard(updatedDashboard);
  };

  return {
    showSavedViews,
    setShowSavedViews,
    handleSaveView,
    handleDeleteView,
    handleApplyView
  };
};

export default useSavedViews;
