
import React, { useState } from 'react';
import { useAutoSummary } from '../context/AutoSummaryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Mail, CalendarDays } from 'lucide-react';

const SummaryEmailSchedule: React.FC = () => {
  const { scheduleSummary, isGenerating } = useAutoSummary();
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const handleSchedule = () => {
    if (email) {
      scheduleSummary(email, frequency);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule Email Delivery</h3>
      <p className="text-sm text-muted-foreground">
        Set up automatic email delivery of this summary to yourself or your team.
      </p>
      
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value) => setFrequency(value as 'daily' | 'weekly' | 'monthly')}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-muted/40 p-3 rounded-md text-sm">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Delivery Schedule</p>
              <p className="text-muted-foreground mt-1">
                {frequency === 'daily' && "You'll receive this summary every day at 8:00 AM."}
                {frequency === 'weekly' && "You'll receive this summary every Monday at 8:00 AM."}
                {frequency === 'monthly' && "You'll receive this summary on the 1st of each month at 8:00 AM."}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleSchedule} 
          disabled={!email || isGenerating}
          className="w-full md:w-auto"
        >
          <Mail className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>
    </div>
  );
};

export default SummaryEmailSchedule;
