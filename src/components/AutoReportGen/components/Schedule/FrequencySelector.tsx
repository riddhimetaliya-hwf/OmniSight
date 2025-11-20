
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ReportFrequency } from "../../types";

interface FrequencySelectorProps {
  frequency: ReportFrequency;
  onFrequencyChange: (value: string) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  onFrequencyChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Frequency</Label>
      <Select 
        value={frequency} 
        onValueChange={onFrequencyChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FrequencySelector;
