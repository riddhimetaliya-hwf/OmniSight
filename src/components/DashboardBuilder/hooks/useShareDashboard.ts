
import { useState } from "react";
import { Dashboard, SharedUser, AccessLevel } from "../types";

export const useShareDashboard = (currentDashboard: Dashboard | null, saveDashboard: (dashboard: Dashboard) => void) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const handleOpenShareDialog = () => {
    setShowShareDialog(true);
  };
  
  const handleCloseShareDialog = () => {
    setShowShareDialog(false);
  };
  
  const handleShareDashboard = (userEmails: string[], accessLevel: AccessLevel) => {
    if (!currentDashboard) return;
    
    const updatedSharedWith = userEmails.map(email => ({
      email,
      accessLevel
    }));
    
    const updatedDashboard = {
      ...currentDashboard,
      sharedWith: updatedSharedWith
    };
    
    saveDashboard(updatedDashboard);
    setShowShareDialog(false);
  };
  
  return {
    showShareDialog,
    handleOpenShareDialog,
    handleCloseShareDialog,
    handleShareDashboard
  };
};

export default useShareDashboard;
