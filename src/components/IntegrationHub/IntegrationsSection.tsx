
import React from "react";
import SectionHeader from "./SectionHeader";
import SearchFilterBar from "./SearchFilterBar";
import { IntegrationHub } from "./Dashboard";

const IntegrationsSection: React.FC = () => {
  return (
    <section className="space-y-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
      <SectionHeader 
        title="Connected Systems" 
        description="Manage your integrated enterprise applications and services."
      >
        <SearchFilterBar />
      </SectionHeader>
      
      <IntegrationHub />
    </section>
  );
};

export default IntegrationsSection;
