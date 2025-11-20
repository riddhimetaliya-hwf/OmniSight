
import React from "react";
import AppShell from "@/components/AppShell/AppShell";
import { AlertManager } from "@/components/AlertManager";

export const AlertManagerPage: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <AlertManager />
      </div>
    </AppShell>
  );
};

export default AlertManagerPage;
