
import React from "react";
import AppShell from "@/components/AppShell/AppShell";
import { OmniAutoPilot } from "@/components/OmniAutoPilot";

export const AutoPilotPage: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <OmniAutoPilot />
      </div>
    </AppShell>
  );
};

export default AutoPilotPage;
