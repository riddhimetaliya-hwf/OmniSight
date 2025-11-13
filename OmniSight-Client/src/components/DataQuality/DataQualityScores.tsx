
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DataQualityScores: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Quality Scores</CardTitle>
        <CardDescription>
          Detailed quality metrics across all data sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-6">
          <p className="text-muted-foreground">
            Data quality scores dashboard will be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataQualityScores;
