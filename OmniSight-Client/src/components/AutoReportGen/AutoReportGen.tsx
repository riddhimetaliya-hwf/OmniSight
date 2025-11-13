
import React from "react";
import { ReportProvider } from "./context/ReportContext";
import ReportHeader from "./components/ReportHeader";
import ReportTabs from "./components/ReportTabs";

const AutoReportGen: React.FC = () => {
  return (
    <ReportProvider>
      <div className="w-full space-y-6">
        <ReportHeader />
        <ReportTabs />
      </div>
    </ReportProvider>
  );
};

export default AutoReportGen;
