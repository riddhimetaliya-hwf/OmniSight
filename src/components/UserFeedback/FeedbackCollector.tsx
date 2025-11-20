
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeedbackCollector: React.FC = () => {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackText, setFeedbackText] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide your feedback before submitting",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, this would send the feedback to a server
    console.log({
      type: feedbackType,
      text: feedbackText,
      contactInfo,
      name
    });
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We value your input."
    });
    
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFeedbackText("");
      setContactInfo("");
      setName("");
      setSubmitted(false);
    }, 2000);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Platform Feedback
        </CardTitle>
        <CardDescription>
          Help us improve OmniSight by sharing your thoughts and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion" className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Suggestion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center">
                  <ThumbsDown className="mr-1 h-4 w-4" />
                  Issue
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question" className="flex items-center">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Question
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts, suggestions, or report an issue..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Your Name (Optional)
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="flex items-center">
                <Mail className="mr-1 h-4 w-4" />
                Email (Optional)
              </Label>
              <Input
                id="contact"
                type="email"
                placeholder="your@email.com"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Your feedback helps us build a better platform
        </p>
        <Button 
          onClick={handleSubmit} 
          disabled={submitted || !feedbackText.trim()}
          className="flex items-center gap-1"
        >
          {submitted ? "Submitted!" : "Submit Feedback"}
          {submitted ? <ThumbsUp className="ml-1 h-4 w-4" /> : <Send className="ml-1 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackCollector;
