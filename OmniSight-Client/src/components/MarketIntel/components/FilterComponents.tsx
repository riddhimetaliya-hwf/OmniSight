
import React from 'react';
import { FilterOptions, NewsSource, AlertLevel, FilterType } from '../types';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Slider 
} from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  CalendarIcon
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Source Filter Component
export const SourceFilters: React.FC<{
  sources: NewsSource[];
  onSourceToggle: (source: NewsSource) => void;
}> = ({ sources, onSourceToggle }) => {
  const sourceLabels: Record<NewsSource, string> = {
    business: 'Business News',
    regulatory: 'Regulatory',
    market: 'Market Trends',
    social: 'Social Media'
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(sourceLabels).map(([source, label]) => (
        <Badge 
          key={source}
          variant="outline"
          className={`cursor-pointer ${
            sources.includes(source as NewsSource) 
              ? 'bg-blue-100 hover:bg-blue-200 border-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onSourceToggle(source as NewsSource)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
};

// Alert Level Filter Component
export const AlertLevelFilters: React.FC<{
  alertLevels?: AlertLevel[];
  onAlertLevelToggle: (level: AlertLevel) => void;
}> = ({ alertLevels = [], onAlertLevelToggle }) => {
  const alertLabels: Record<AlertLevel, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(alertLabels).map(([level, label]) => (
        <Badge 
          key={level}
          variant="outline"
          className={`cursor-pointer ${
            alertLevels.includes(level as AlertLevel)
              ? level === 'critical' ? 'bg-red-100 hover:bg-red-200 border-red-300' :
                level === 'high' ? 'bg-orange-100 hover:bg-orange-200 border-orange-300' :
                level === 'medium' ? 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' :
                'bg-blue-100 hover:bg-blue-200 border-blue-300'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onAlertLevelToggle(level as AlertLevel)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
};

// Relevance Score Filter Component
export const RelevanceScoreFilter: React.FC<{
  relevanceThreshold?: number;
  onRelevanceChange: (value: number[]) => void;
}> = ({ relevanceThreshold = 0, onRelevanceChange }) => {
  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
      <Slider
        defaultValue={[relevanceThreshold]}
        max={100}
        step={5}
        onValueChange={onRelevanceChange}
      />
      <div className="text-xs text-center">
        Minimum score: {relevanceThreshold}
      </div>
    </div>
  );
};

// Date Range Filter Component
export const DateRangeFilter: React.FC<{
  dateRange?: { from: Date | null; to: Date | null };
  onDateChange: (field: 'from' | 'to', date: Date | null) => void;
  onClearDates: () => void;
}> = ({ dateRange, onDateChange, onClearDates }) => {
  return (
    <div className="space-y-3 mt-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs mb-1 block">From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left font-normal h-8 text-xs"
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {dateRange?.from ? (
                  dateRange.from.toLocaleDateString()
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange?.from || undefined}
                onSelect={(date) => onDateChange('from', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs mb-1 block">To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left font-normal h-8 text-xs"
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {dateRange?.to ? (
                  dateRange.to.toLocaleDateString()
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange?.to || undefined}
                onSelect={(date) => onDateChange('to', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {(dateRange?.from || dateRange?.to) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs w-full"
          onClick={onClearDates}
        >
          Clear dates
        </Button>
      )}
    </div>
  );
};

// Filter Popover Component for category filters (industries, departments, etc.)
export const FilterPopoverButton: React.FC<{ 
  type: FilterType; 
  title: string; 
  count: number;
  active: boolean;
  onClick: () => void;
}> = ({ type, title, count, active, onClick }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className={`h-8 text-xs ${active ? 'border-blue-400 bg-blue-50 hover:bg-blue-100' : ''}`}
    onClick={onClick}
  >
    {title}
    {count > 0 && (
      <Badge variant="secondary" className="ml-1 h-5 bg-blue-200">
        {count}
      </Badge>
    )}
  </Button>
);

// Filter Popover Content Component
export const FilterPopoverContent: React.FC<{ 
  title: string; 
  options: string[];
  selectedOptions: string[];
  onOptionToggle: (option: string, checked: boolean) => void;
}> = ({ title, options, selectedOptions, onOptionToggle }) => (
  <div className="space-y-3">
    <div className="font-medium text-sm">{title}</div>
    <div className="max-h-60 overflow-y-auto space-y-2">
      {options.map(option => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox 
            id={`option-${option}`}
            checked={selectedOptions.includes(option)}
            onCheckedChange={(checked) => 
              onOptionToggle(option, checked as boolean)
            }
          />
          <Label 
            htmlFor={`option-${option}`}
            className="text-sm font-normal cursor-pointer"
          >
            {option}
          </Label>
        </div>
      ))}
    </div>
  </div>
);

// Advanced Filters Popover Component
export const AdvancedFiltersPopover: React.FC<{
  filters: FilterOptions;
  activeFiltersCount: number;
  onSourceToggle: (source: NewsSource) => void;
  onAlertLevelToggle: (level: AlertLevel) => void;
  onRelevanceChange: (value: number[]) => void;
  onDateChange: (field: 'from' | 'to', date: Date | null) => void;
  onClearDates: () => void;
  onClearAllFilters: () => void;
}> = ({ 
  filters, 
  activeFiltersCount, 
  onSourceToggle, 
  onAlertLevelToggle, 
  onRelevanceChange, 
  onDateChange, 
  onClearDates, 
  onClearAllFilters 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filter Options</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={onClearAllFilters}
        >
          Clear all
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="sources">
          <AccordionTrigger className="text-sm py-2">Sources</AccordionTrigger>
          <AccordionContent>
            <SourceFilters 
              sources={filters.sources} 
              onSourceToggle={onSourceToggle} 
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="alertLevels">
          <AccordionTrigger className="text-sm py-2">Alert Levels</AccordionTrigger>
          <AccordionContent>
            <AlertLevelFilters 
              alertLevels={filters.alertLevel} 
              onAlertLevelToggle={onAlertLevelToggle} 
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="relevance">
          <AccordionTrigger className="text-sm py-2">Relevance Score</AccordionTrigger>
          <AccordionContent>
            <RelevanceScoreFilter
              relevanceThreshold={filters.relevanceThreshold}
              onRelevanceChange={onRelevanceChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="dateRange">
          <AccordionTrigger className="text-sm py-2">Date Range</AccordionTrigger>
          <AccordionContent>
            <DateRangeFilter
              dateRange={filters.dateRange}
              onDateChange={onDateChange}
              onClearDates={onClearDates}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
