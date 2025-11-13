
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { DemoEngine } from '@/components/DemoEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Waves } from 'lucide-react';

const VoiceDashboardPage: React.FC = () => {
  return (
    <DemoEngine>
      <Layout 
        title="Voice Dashboard" 
        subtitle="Voice-controlled dashboard interface"
      >
        <div className="h-[calc(100vh-180px)]">
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="text-center p-8">
              <div className="flex space-x-4 text-muted-foreground/70 mb-6">
                <Mic className="h-12 w-12" />
                <Waves className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-medium mb-4">Voice Dashboard</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Voice-controlled dashboard interface will be implemented here.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </DemoEngine>
  );
};

export default VoiceDashboardPage;
