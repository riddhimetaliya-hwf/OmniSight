
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ThumbsUp, Filter, PlusCircle, Users, MessageCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for feature requests
const mockFeatureRequests = [
  {
    id: 1,
    title: "AI-powered anomaly detection",
    description: "Automatically detect abnormal patterns in data and alert users",
    votes: 42,
    category: "analytics",
    status: "planned",
    submittedBy: "Sarah J.",
    timeAgo: "2 days ago",
    hasVoted: false
  },
  {
    id: 2,
    title: "Dark mode support across all modules",
    description: "Add consistent dark mode support throughout the entire platform",
    votes: 38,
    category: "ui",
    status: "in-progress",
    submittedBy: "Michael T.",
    timeAgo: "5 days ago",
    hasVoted: true
  },
  {
    id: 3,
    title: "Mobile app for dashboard access",
    description: "Create a mobile application for on-the-go access to dashboards",
    votes: 27,
    category: "mobile",
    status: "planned",
    submittedBy: "Alex P.",
    timeAgo: "1 week ago",
    hasVoted: false
  },
  {
    id: 4,
    title: "Export to PowerPoint presentation",
    description: "Add ability to export dashboards directly to PowerPoint slides",
    votes: 24,
    category: "export",
    status: "under-review",
    submittedBy: "Emma R.",
    timeAgo: "2 weeks ago",
    hasVoted: false
  },
  {
    id: 5,
    title: "Custom alert thresholds per user",
    description: "Allow users to set their own thresholds for notifications",
    votes: 19,
    category: "alerts",
    status: "planned",
    submittedBy: "David M.",
    timeAgo: "3 weeks ago",
    hasVoted: false
  }
];

const FeatureVoting: React.FC = () => {
  const { toast } = useToast();
  const [featureRequests, setFeatureRequests] = useState(mockFeatureRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  
  const handleVote = (id: number) => {
    setFeatureRequests(prev => 
      prev.map(feature => 
        feature.id === id 
          ? { 
              ...feature, 
              votes: feature.hasVoted ? feature.votes - 1 : feature.votes + 1,
              hasVoted: !feature.hasVoted
            } 
          : feature
      )
    );
    
    const feature = featureRequests.find(f => f.id === id);
    if (feature) {
      toast({
        title: feature.hasVoted ? "Vote Removed" : "Vote Added",
        description: feature.hasVoted 
          ? `You've removed your vote for "${feature.title}"` 
          : `You've voted for "${feature.title}"`
      });
    }
  };
  
  const handleAddFeature = () => {
    if (!newFeatureTitle.trim()) {
      toast({
        title: "Feature Title Required",
        description: "Please provide a title for your feature request",
        variant: "destructive"
      });
      return;
    }
    
    const newFeature = {
      id: featureRequests.length + 1,
      title: newFeatureTitle,
      description: newFeatureDescription || "No description provided",
      votes: 1,
      category: "new",
      status: "under-review",
      submittedBy: "You",
      timeAgo: "Just now",
      hasVoted: true
    };
    
    setFeatureRequests([newFeature, ...featureRequests]);
    
    toast({
      title: "Feature Request Submitted",
      description: "Your feature request has been added and received your vote"
    });
    
    // Reset form
    setNewFeatureTitle("");
    setNewFeatureDescription("");
    setShowNewFeatureForm(false);
  };
  
  const filteredRequests = featureRequests.filter(feature => 
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planned</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Progress</Badge>;
      case "under-review":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Under Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          Feature Requests
        </CardTitle>
        <CardDescription>
          Vote for features you'd like to see implemented in future updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search feature requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setShowNewFeatureForm(!showNewFeatureForm)}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Request</span>
          </Button>
        </div>
        
        {showNewFeatureForm && (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Submit New Feature Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Feature title"
                  value={newFeatureTitle}
                  onChange={(e) => setNewFeatureTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Feature description (optional)"
                  value={newFeatureDescription}
                  onChange={(e) => setNewFeatureDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewFeatureForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFeature}>Submit Request</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="my-votes">My Votes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular" className="mt-4 space-y-4">
            {filteredRequests
              .sort((a, b) => b.votes - a.votes)
              .map(feature => (
                <Card key={feature.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="flex flex-col items-center justify-center p-4 border-r bg-muted/30 w-20">
                      <Button 
                        variant={feature.hasVoted ? "default" : "outline"} 
                        size="sm"
                        className="rounded-full h-10 w-10 p-0"
                        onClick={() => handleVote(feature.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="mt-1 font-bold">{feature.votes}</span>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(feature.status)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>Submitted by {feature.submittedBy}</span>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>4 comments</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{feature.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4 space-y-4">
            {filteredRequests
              .sort((a, b) => {
                // This is a simple simulation - in a real app this would be based on actual dates
                return a.timeAgo.includes("Just now") ? -1 : 
                       b.timeAgo.includes("Just now") ? 1 :
                       a.timeAgo.includes("day") && b.timeAgo.includes("week") ? -1 :
                       b.timeAgo.includes("day") && a.timeAgo.includes("week") ? 1 : 0;
              })
              .map(feature => (
                <Card key={feature.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="flex flex-col items-center justify-center p-4 border-r bg-muted/30 w-20">
                      <Button 
                        variant={feature.hasVoted ? "default" : "outline"} 
                        size="sm"
                        className="rounded-full h-10 w-10 p-0"
                        onClick={() => handleVote(feature.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="mt-1 font-bold">{feature.votes}</span>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(feature.status)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>Submitted by {feature.submittedBy}</span>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>4 comments</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{feature.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="my-votes" className="mt-4 space-y-4">
            {filteredRequests
              .filter(feature => feature.hasVoted)
              .map(feature => (
                <Card key={feature.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="flex flex-col items-center justify-center p-4 border-r bg-muted/30 w-20">
                      <Button 
                        variant="default"
                        size="sm"
                        className="rounded-full h-10 w-10 p-0"
                        onClick={() => handleVote(feature.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="mt-1 font-bold">{feature.votes}</span>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <div>
                          {getStatusBadge(feature.status)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>Submitted by {feature.submittedBy}</span>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>4 comments</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{feature.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            
            {filteredRequests.filter(feature => feature.hasVoted).length === 0 && (
              <div className="text-center py-6">
                <ThumbsUp className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">No votes yet</h3>
                <p className="text-sm text-muted-foreground">Vote for features you'd like to see implemented</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeatureVoting;
