
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessStepProps {
  onCreateAnother: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onCreateAnother }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle className="h-5 w-5" />
          Alert Created Successfully
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-green-50 border border-green-100 p-4 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-green-700">Alert is now active</h3>
          <p className="text-sm text-green-600 mt-1">
            You'll be notified when the conditions are met
          </p>
        </div>
        
        <div className="space-y-2 text-center text-sm text-muted-foreground pt-2">
          <p>Your alert has been created and the system will monitor for the specified conditions.</p>
          <p>You can edit or delete this alert at any time from the Alerts dashboard.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/alerts" className="gap-1">
            <Eye className="h-4 w-4" /> View All Alerts
          </Link>
        </Button>
        <Button onClick={onCreateAnother} className="gap-1">
          <Plus className="h-4 w-4" /> Create Another
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuccessStep;
