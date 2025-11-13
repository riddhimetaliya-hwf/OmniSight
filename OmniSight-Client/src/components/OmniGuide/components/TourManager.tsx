
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash, Plus, WandSparkles } from 'lucide-react';
import { useOmniGuideContext } from '../context/OmniGuideContext';
import { Tour, UserRole } from '../types';

const TourManager: React.FC = () => {
  const { 
    availableTours, 
    userRole, 
    setUserRole, 
    isTooltipEnabled, 
    toggleTooltips 
  } = useOmniGuideContext();
  
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    toast({
      title: "User Role Updated",
      description: `Switched to ${role} role. Tour list updated.`,
    });
  };

  const handleToggleTooltips = () => {
    toggleTooltips();
  };

  const handleEditTour = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  // Mock handlers that would be implemented in a real app
  const handleSaveTour = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Tour Updated",
      description: "Your changes to the tour have been saved.",
    });
  };

  const handleDeleteTour = (tourId: string) => {
    toast({
      title: "Tour Deleted",
      description: "The tour has been removed from the system.",
    });
  };

  const handleAddTour = () => {
    toast({
      title: "New Tour Created",
      description: "A new tour template has been created. You can now edit it.",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tour & Onboarding Management</CardTitle>
          <CardDescription>
            Configure guided tours and onboarding experiences for your users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Global Tooltip Settings</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable all tooltips across the application
              </p>
            </div>
            <Switch 
              checked={isTooltipEnabled} 
              onCheckedChange={handleToggleTooltips} 
              aria-label="Toggle tooltips"
            />
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Preview as Role</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Change role to preview different tour experiences
            </p>
            <Select value={userRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exec">Executive</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Available Tours</CardTitle>
            <CardDescription>
              Manage and customize tours for different modules
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAddTour}>
            <Plus className="h-4 w-4 mr-1" />
            Add Tour
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Available tours for {userRole} role.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tour Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Auto-Start</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableTours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.title}</TableCell>
                  <TableCell>{tour.module}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={tour.autoStart} 
                      disabled 
                      aria-label={`Toggle ${tour.title} auto-start`}
                    />
                  </TableCell>
                  <TableCell>{tour.steps.length}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 mr-2"
                      onClick={() => handleEditTour(tour)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDeleteTour(tour.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>
              Customize this tour's content, steps, and settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTour && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tour-title">Tour Title</Label>
                  <Input id="tour-title" defaultValue={selectedTour.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tour-module">Module</Label>
                  <Select defaultValue={selectedTour.module}>
                    <SelectTrigger id="tour-module">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="workflow">Workflow Studio</SelectItem>
                      <SelectItem value="copilot">Executive Copilot</SelectItem>
                      <SelectItem value="command">Command Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tour-description">Description</Label>
                <Textarea id="tour-description" defaultValue={selectedTour.description} />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-start" defaultChecked={selectedTour.autoStart} />
                <Label htmlFor="auto-start">Auto-start tour for new users</Label>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Tour Steps</h3>
                <div className="space-y-2">
                  {selectedTour.steps.map((step, index) => (
                    <Card key={step.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Step {index + 1}: {step.title}</span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button variant="outline" className="mt-2 w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTour}>
              <WandSparkles className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TourManager;
