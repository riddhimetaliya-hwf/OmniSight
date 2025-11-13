
import React from 'react';
import { TemplateCard } from './TemplateCard';
import { templateData } from './nodeData';

export const TemplatesTabContent: React.FC = () => {
  return (
    <div className="p-4 mt-0">
      <div className="space-y-4">
        {templateData.map((template, i) => (
          <TemplateCard key={i} name={template} />
        ))}
      </div>
    </div>
  );
};
