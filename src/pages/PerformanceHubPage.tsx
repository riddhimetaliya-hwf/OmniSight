
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { PerformanceHub } from '@/components/PerformanceHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessProcessInsightsAI } from '@/components/BusinessProcessInsightsAI';

const PerformanceHubPage: React.FC = () => {
  const [showInsights, setShowInsights] = useState(true);

  return (
    <Layout title="Performance Hub" subtitle="IT & Business Performance Center">
      {showInsights && (
        <div className="mb-6">
          <Card className="bg-muted/30 border border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">New</Badge>
                  AI Process Insights
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowInsights(false)}>
                  Hide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BusinessProcessInsightsAI />
            </CardContent>
          </Card>
        </div>
      )}
      
      <PerformanceHub />
    </Layout>
  );
};

export default PerformanceHubPage;
