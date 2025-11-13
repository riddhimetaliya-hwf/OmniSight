
import React from 'react';

interface StatusBadgeProps {
  type: string; 
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, className }) => {
  let badgeText = '';
  let badgeColor = '';
  
  switch (type) {
    case 'chat':
      badgeText = 'AI Assistant';
      badgeColor = 'bg-primary/15 text-primary';
      break;
    case 'dashboard':
      badgeText = 'Business Metrics';
      badgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      break;
    case 'settings':
      badgeText = 'Preferences';
      badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400';
      break;
  }
  
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${badgeColor} ${className}`}>
      {badgeText}
    </span>
  );
};
