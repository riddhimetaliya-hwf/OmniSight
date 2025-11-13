
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

interface EmptyDashboardProps {
  onCreateDashboard: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onCreateDashboard }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Dashboard Available</CardTitle>
        <CardDescription>
          Create your first dashboard to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onCreateDashboard}>
          <Plus className="mr-2 h-4 w-4" />
          Create Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export const DashboardLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Skeleton className="h-12 w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
};
