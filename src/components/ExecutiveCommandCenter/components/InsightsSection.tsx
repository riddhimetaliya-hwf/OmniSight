
import React from 'react';
import InsightCard from './InsightCard';
import { ExecutiveRole, insightsByRole } from '../data/insightsData';

interface InsightsSectionProps {
  role: ExecutiveRole;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ role }) => {
  const insights = insightsByRole[role] || insightsByRole['CEO'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <InsightCard
          key={index}
          title={insight.title}
          description={insight.description}
          category={insight.category}
          date={insight.date}
        />
      ))}
    </div>
  );
};

export default InsightsSection;
