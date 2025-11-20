
import React from "react";
import OpportunityHeader from "./components/OpportunityHeader";
import OpportunityInsightsList from "./components/OpportunityInsightsList";
import OpportunityActionHistory from "./components/OpportunityActionHistory";
import OpportunityVoiceCommand from "./components/OpportunityVoiceCommand";
import { OpportunityProvider } from "./context/OpportunityContext";

const OpportunityResponder: React.FC = () => {
  return (
    <OpportunityProvider>
      <div className="w-full space-y-6">
        <OpportunityHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OpportunityInsightsList />
          </div>
          <div className="space-y-6">
            <OpportunityVoiceCommand />
            <OpportunityActionHistory />
          </div>
        </div>
      </div>
    </OpportunityProvider>
  );
};

export default OpportunityResponder;
