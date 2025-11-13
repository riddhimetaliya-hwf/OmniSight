
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SavedView } from '@/components/UserPrefs/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreVertical, Star, Edit, Trash, Share2, Copy } from 'lucide-react';
import { format } from 'date-fns';

interface SavedViewsManagerProps {
  views: SavedView[];
  onSaveView: (view: SavedView) => void;
  onDeleteView: (viewId: string) => void;
  onApplyView: (view: SavedView) => void;
  onShareView: (view: SavedView) => void;
  onDuplicateView: (view: SavedView) => void;
  currentType?: 'dashboard' | 'report' | 'insight';
}

const SavedViewsManager: React.FC<SavedViewsManagerProps> = ({
  views,
  onSaveView,
  onDeleteView,
  onApplyView,
  onShareView,
  onDuplicateView,
  currentType = 'dashboard'
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newView, setNewView] = useState<Partial<SavedView>>({
    name: '',
    description: '',
    type: currentType,
    isDefault: false
  });
  const { toast } = useToast();

  const filteredViews = currentType ? views.filter(view => view.type === currentType) : views;

  const handleSaveView = () => {
    if (!newView.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for your saved view.",
        variant: "destructive"
      });
      return;
    }

    const view: SavedView = {
      id: `view-${Date.now()}`,
      name: newView.name,
      description: newView.description,
      type: newView.type as 'dashboard' | 'report' | 'insight',
      config: {}, // This would be populated with current state
      filters: {}, // This would be populated with current filters
      layout: {}, // This would be populated with current layout
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: newView.isDefault
    };

    onSaveView(view);
    setNewView({
      name: '',
      description: '',
      type: currentType,
      isDefault: false
    });
    setIsCreateOpen(false);

    toast({
      title: "View saved",
      description: `${view.name} has been saved successfully.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Views</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Save Current View
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current View</DialogTitle>
              <DialogDescription>
                Save your current configuration as a view to quickly return to it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={newView.name}
                  onChange={(e) => setNewView({ ...newView, name: e.target.value })}
                  placeholder="My View"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={newView.description || ''}
                  onChange={(e) => setNewView({ ...newView, description: e.target.value })}
                  placeholder="Describe what this view is useful for..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="default"
                  checked={newView.isDefault || false}
                  onChange={(e) => setNewView({ ...newView, isDefault: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="default" className="text-sm font-medium">
                  Set as default view
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveView}>Save View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredViews.length > 0 ? (
        <ScrollArea className="h-[300px] pr-3">
          <div className="grid gap-3">
            {filteredViews.map((view) => (
              <Card key={view.id} className="border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {view.isDefault && <Star className="h-4 w-4 text-yellow-500 mr-2" />}
                      <CardTitle className="text-base">{view.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onApplyView(view)}>
                          <Star className="h-4 w-4 mr-2" />
                          Apply View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateView(view)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShareView(view)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteView(view.id)} className="text-red-500">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                {view.description && (
                  <CardContent className="py-2">
                    <CardDescription>{view.description}</CardDescription>
                  </CardContent>
                )}
                <CardFooter className="pt-2 text-xs text-muted-foreground">
                  Last updated {format(new Date(view.updatedAt), 'MMM d, yyyy')}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No saved views yet</p>
          <p className="text-sm mt-1">Save your current configuration to quickly access it later</p>
        </div>
      )}
    </div>
  );
};

export default SavedViewsManager;
