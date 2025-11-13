
import React from "react";
import AppShell from "@/components/AppShell/AppShell";
import { InsightsEngine } from "@/components/InsightsEngine";

export const InsightsPage: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">
          Discover actionable insights about your business performance
        </p>
        <InsightsEngine />
      </div>
    </AppShell>
  );
};

export default InsightsPage;
