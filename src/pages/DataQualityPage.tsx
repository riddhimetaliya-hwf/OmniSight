
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DataQualityScores, 
  DataLineage, 
  DataValidationRules 
} from '@/components/DataQuality';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { ContextualHelp } from '@/components/LearningResources';

const DataQualityPage: React.FC = () => {
  return (
    <Layout 
      title="Data Quality" 
      subtitle="Monitor and improve the quality of your data"
      action={
        <ContextualHelp 
          topic="Data Quality Dashboard" 
          sections={[
            {
              id: 'overview',
              title: 'Overview',
              content: (
                <div className="space-y-4">
                  <p>The Data Quality Dashboard provides a centralized view of data quality across your organization.</p>
                  <p>Use this dashboard to monitor quality metrics, track data lineage, and set up validation rules to ensure data integrity.</p>
                </div>
              )
            },
            {
              id: 'quality-scores',
              title: 'Quality Scores',
              content: (
                <div className="space-y-4">
                  <p>Quality scores measure your data health across multiple dimensions:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><span className="font-medium">Completeness</span>: Are all required fields populated?</li>
                    <li><span className="font-medium">Accuracy</span>: Does data match expected values and formats?</li>
                    <li><span className="font-medium">Consistency</span>: Is data consistent across related records?</li>
                    <li><span className="font-medium">Timeliness</span>: How fresh is your data?</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'data-lineage',
              title: 'Data Lineage',
              content: (
                <div className="space-y-4">
                  <p>Data lineage tracks the flow of data from source to destination.</p>
                  <p>This helps identify where issues may be introduced and understand the impact of data quality problems.</p>
                </div>
              )
            }
          ]}
        />
      }
    >
      <Tabs defaultValue="quality-scores" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="quality-scores">Quality Scores</TabsTrigger>
            <TabsTrigger value="lineage">Data Lineage</TabsTrigger>
            <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="quality-scores">
          <DataQualityScores />
        </TabsContent>
        
        <TabsContent value="lineage">
          <DataLineage />
        </TabsContent>
        
        <TabsContent value="validation">
          <DataValidationRules />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default DataQualityPage;
