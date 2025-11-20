
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InsightsErrorProps {
  error: string;
  onRetry: () => void;
}

const InsightsError: React.FC<InsightsErrorProps> = ({ error, onRetry }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Insights Engine</CardTitle>
        <CardDescription>
          There was an error loading insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error}</p>
        <Button onClick={onRetry} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};

export default InsightsError;
