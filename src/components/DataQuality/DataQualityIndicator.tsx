
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QualityScore {
  overall: number;
  completeness?: number;
  accuracy?: number;
  consistency?: number;
  timeliness?: number;
}

export interface DataQualityIndicatorProps {
  qualityScore: QualityScore;
  size?: 'small' | 'medium' | 'large';
  dataSource?: string;
  lastUpdated?: Date;
}

export const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({
  qualityScore,
  size = 'medium',
  dataSource,
  lastUpdated
}) => {
  const getColorForScore = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-emerald-400';
    if (score >= 50) return 'bg-yellow-400';
    if (score >= 30) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  const getSize = () => {
    switch (size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small': return 'text-[8px]';
      case 'large': return 'text-xs';
      default: return 'text-[10px]';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className={`${getSize()} rounded-full ${getColorForScore(qualityScore.overall)} text-white flex items-center justify-center ${getFontSize()} font-bold`}
          >
            {qualityScore.overall}
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Data Quality Score: {qualityScore.overall}/100</h4>
            {dataSource && <p className="text-sm">Source: {dataSource}</p>}
            {lastUpdated && <p className="text-sm">Last updated: {lastUpdated.toLocaleDateString()}</p>}
            <div className="space-y-1">
              {qualityScore.completeness !== undefined && (
                <div className="flex justify-between text-sm">
                  <span>Completeness:</span>
                  <span>{qualityScore.completeness}%</span>
                </div>
              )}
              {qualityScore.accuracy !== undefined && (
                <div className="flex justify-between text-sm">
                  <span>Accuracy:</span>
                  <span>{qualityScore.accuracy}%</span>
                </div>
              )}
              {qualityScore.consistency !== undefined && (
                <div className="flex justify-between text-sm">
                  <span>Consistency:</span>
                  <span>{qualityScore.consistency}%</span>
                </div>
              )}
              {qualityScore.timeliness !== undefined && (
                <div className="flex justify-between text-sm">
                  <span>Timeliness:</span>
                  <span>{qualityScore.timeliness}%</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataQualityIndicator;
