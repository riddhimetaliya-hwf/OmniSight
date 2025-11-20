
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Plus, FileCode, Wand2, GitBranch, FileDown, ArrowRight } from 'lucide-react';

interface WelcomeCardProps {
  onStartTour: () => void;
  onNewWorkflow: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onStartTour, onNewWorkflow }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 pointer-events-none">
      <Card className="pointer-events-auto max-w-2xl shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Build Your Automated Workflow</CardTitle>
          <CardDescription className="text-base">
            Create powerful automation flows by connecting actions, triggers, and conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard 
              icon={<FileCode className="h-10 w-10 text-primary/70" />}
              title="Drag & Drop Nodes"
              description="Build your workflow visually by dragging and connecting nodes on the canvas"
            />
            <FeatureCard 
              icon={<Wand2 className="h-10 w-10 text-primary/70" />}
              title="AI Suggestions"
              description="Get intelligent suggestions to optimize your workflow at every step"
            />
            <FeatureCard 
              icon={<GitBranch className="h-10 w-10 text-primary/70" />}
              title="Conditional Logic"
              description="Create complex decision trees with if/then logic and branches"
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Getting Started is Easy</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">1</span>
                <span>Start with a template or create a blank workflow</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">2</span>
                <span>Drag nodes from the sidebar onto the canvas</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">3</span>
                <span>Connect nodes with the Flow Editor to create your automation</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">4</span>
                <span>Test your workflow with the simulation feature</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-medium">5</span>
                <span>Save and deploy your workflow when you're ready</span>
              </li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between p-6 pt-4 gap-3">
          <Button 
            onClick={onStartTour} 
            variant="outline" 
            className="gap-2 w-full sm:w-auto"
          >
            <Play className="h-4 w-4" />
            Start Tutorial
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={() => window.open('#templates', '_self')}
            >
              <FileDown className="h-4 w-4" />
              Browse Templates
            </Button>
            <Button 
              onClick={onNewWorkflow} 
              variant="default"
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30 border border-muted">
      <div className="mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};
