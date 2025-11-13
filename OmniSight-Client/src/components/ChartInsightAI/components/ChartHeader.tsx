
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ChartDataset } from '../types';
import { getChartIcon } from '../utils/chartUtils';

interface ChartHeaderProps {
  selectedDataset: ChartDataset;
  datasets: ChartDataset[];
  hasActiveInsight: boolean;
  onDatasetChange: (datasetId: string) => void;
  onOpenInsightPanel: () => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  selectedDataset,
  datasets,
  hasActiveInsight,
  onDatasetChange,
  onOpenInsightPanel
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center">
            {getChartIcon(selectedDataset.type)}
            <span className="ml-2">{selectedDataset.title}</span>
          </CardTitle>
          <CardDescription>
            Click on data points to get AI explanations
          </CardDescription>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
            onClick={onOpenInsightPanel}
            disabled={!hasActiveInsight}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 overflow-auto pb-1">
        {datasets.map(dataset => (
          <Button
            key={dataset.id}
            variant={selectedDataset.id === dataset.id ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => onDatasetChange(dataset.id)}
          >
            {getChartIcon(dataset.type)}
            {dataset.title}
          </Button>
        ))}
      </div>
    </>
  );
};

export default ChartHeader;
