
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DataLineage: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Lineage</CardTitle>
        <CardDescription>
          Track the origins and transformations of your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-6">
          <p className="text-muted-foreground">
            Data lineage visualization will be implemented here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataLineage;
