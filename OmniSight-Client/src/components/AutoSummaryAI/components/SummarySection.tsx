
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Pencil, 
  Check, 
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { SummarySection as SummarySectionType } from '../types';
import { useAutoSummary } from '../context/AutoSummaryContext';

interface SummarySectionProps {
  section: SummarySectionType;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ 
  section, 
  isEditing,
  onEdit,
  onCancel
}) => {
  const { editSummarySection } = useAutoSummary();
  const [editedContent, setEditedContent] = useState(section.content);
  
  const handleSave = () => {
    editSummarySection(section.id, editedContent);
    onCancel();
  };
  
  const getIcon = () => {
    switch (section.type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  const getBorderClass = () => {
    switch (section.type) {
      case 'trend':
        return 'border-l-4 border-l-blue-500';
      case 'anomaly':
        return 'border-l-4 border-l-amber-500';
      case 'recommendation':
        return 'border-l-4 border-l-purple-500';
      default:
        return '';
    }
  };
  
  return (
    <Card className={`${getBorderClass()} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {getIcon()}
          {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
            autoFocus
          />
        ) : (
          <p className="text-sm">{section.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SummarySection;
