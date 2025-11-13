
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportFrequency, ReportSchedule } from "./types";
import { Clock } from "lucide-react";
import { 
  EmailList, 
  FrequencySelector, 
  DateSelector, 
  EmailInput 
} from "./components/Schedule";

interface ReportScheduleOptionsProps {
  schedule: ReportSchedule | null;
  onScheduleChange: (schedule: ReportSchedule | null) => void;
}

const ReportScheduleOptions: React.FC<ReportScheduleOptionsProps> = ({
  schedule,
  onScheduleChange
}) => {
  const [emails, setEmails] = useState<string[]>(schedule?.emails || []);
  const [newEmail, setNewEmail] = useState("");
  const [frequency, setFrequency] = useState<ReportFrequency>(
    schedule?.frequency || "weekly"
  );
  const [nextRun, setNextRun] = useState<Date>(
    schedule?.nextRun || new Date()
  );

  const handleAddEmail = () => {
    if (newEmail && isValidEmail(newEmail) && !emails.includes(newEmail)) {
      const updatedEmails = [...emails, newEmail];
      setEmails(updatedEmails);
      setNewEmail("");
      
      // Update parent component
      updateSchedule(frequency, nextRun, updatedEmails);
    }
  };

  const handleRemoveEmail = (email: string) => {
    const updatedEmails = emails.filter(e => e !== email);
    setEmails(updatedEmails);
    
    // Update parent component
    updateSchedule(frequency, nextRun, updatedEmails);
  };

  const handleFrequencyChange = (value: string) => {
    const newFrequency = value as ReportFrequency;
    setFrequency(newFrequency);
    
    // Update parent component
    updateSchedule(newFrequency, nextRun, emails);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNextRun(date);
      
      // Update parent component
      updateSchedule(frequency, date, emails);
    }
  };

  const updateSchedule = (
    freq: ReportFrequency,
    date: Date,
    emailList: string[]
  ) => {
    if (emailList.length === 0) {
      onScheduleChange(null);
    } else {
      onScheduleChange({
        frequency: freq,
        nextRun: date,
        emails: emailList
      });
    }
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FrequencySelector 
              frequency={frequency}
              onFrequencyChange={handleFrequencyChange}
            />
            
            <DateSelector
              nextRun={nextRun}
              onDateChange={handleDateChange}
            />
          </div>
          
          <div className="space-y-4">
            <EmailInput
              newEmail={newEmail}
              onEmailChange={setNewEmail}
              onAddEmail={handleAddEmail}
              isValidEmail={isValidEmail(newEmail)}
              isExistingEmail={emails.includes(newEmail)}
            />
            
            <div className="border rounded-md min-h-32 p-2">
              <EmailList 
                emails={emails} 
                onRemoveEmail={handleRemoveEmail}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {schedule 
                ? `Report will be sent ${frequency} to ${emails.length} recipient(s)`
                : "Add at least one recipient to schedule this report"}
            </span>
          </div>
          
          {schedule && (
            <Button 
              variant="outline" 
              onClick={() => {
                setEmails([]);
                onScheduleChange(null);
              }}
            >
              Cancel Schedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportScheduleOptions;
