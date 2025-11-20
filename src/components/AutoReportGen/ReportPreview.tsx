
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportSection } from "./types";
import ReportSectionRenderer from "./ReportSectionRenderer";
import { GripVertical, X, Plus, PenIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReportPreviewProps {
  title: string;
  sections: ReportSection[];
  onSectionReorder: (sections: ReportSection[]) => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  title,
  sections,
  onSectionReorder
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [reportTitle, setReportTitle] = useState(title);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);
    
    onSectionReorder(newSections);
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  const handleRemoveSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    onSectionReorder(newSections);
  };

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    // Here you would typically update the title in the parent component
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editingTitle ? (
            <div className="flex gap-2">
              <Input
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="text-2xl font-bold py-2"
                autoFocus
              />
              <Button onClick={handleTitleSubmit}>Save</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{reportTitle}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingTitle(true)}
              >
                <PenIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card
            key={section.id}
            className={`relative ${draggedIndex === index ? 'opacity-50' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => handleRemoveSection(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="cursor-move h-6 w-6 flex items-center justify-center">
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
            <CardContent className="pt-6">
              <ReportSectionRenderer section={section} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportPreview;
