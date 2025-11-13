
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { Department, TimeFrame, Audience } from "./types";

interface ReportPromptInputProps {
  onSubmit: (
    prompt: string, 
    department: Department, 
    timeframe: TimeFrame, 
    audience: Audience
  ) => void;
  isLoading: boolean;
}

const examplePrompts = [
  "Create a sales performance report for Q1",
  "Generate a marketing campaign effectiveness report",
  "Prepare a financial overview with key metrics",
  "Analyze customer retention trends for the last quarter",
  "Summarize operational efficiency metrics"
];

const ReportPromptInput: React.FC<ReportPromptInputProps> = ({ 
  onSubmit, 
  isLoading 
}) => {
  const [prompt, setPrompt] = useState("");
  const [department, setDepartment] = useState<Department>("all");
  const [timeframe, setTimeframe] = useState<TimeFrame>("last30d");
  const [audience, setAudience] = useState<Audience>("executive");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt, department, timeframe, audience);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create a New Report</CardTitle>
        <CardDescription>
          Describe the report you need or use the guided options below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Report Description
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Create a sales report for Q1 with revenue trends"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? (
                  "Generating..."
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={department} 
                onValueChange={(value) => setDepartment(value as Department)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Frame</label>
              <Select 
                value={timeframe} 
                onValueChange={(value) => setTimeframe(value as TimeFrame)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Time Frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last24h">Last 24 Hours</SelectItem>
                  <SelectItem value="last7d">Last 7 Days</SelectItem>
                  <SelectItem value="last30d">Last 30 Days</SelectItem>
                  <SelectItem value="last90d">Last Quarter</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select 
                value={audience} 
                onValueChange={(value) => setAudience(value as Audience)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="all-staff">All Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <p className="text-sm font-medium mb-2">Example prompts:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              onClick={() => handleExampleClick(example)}
              className="text-xs"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              {example}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportPromptInput;
