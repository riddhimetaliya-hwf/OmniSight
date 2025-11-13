
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Book, GraduationCap, MessageCircle, Search, ThumbsUp, Video } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: <Book className="h-4 w-4" /> },
    { id: 'dashboards', name: 'Dashboards & Reports', icon: <Book className="h-4 w-4" /> },
    { id: 'integrations', name: 'Integrations', icon: <Book className="h-4 w-4" /> },
    { id: 'data-quality', name: 'Data Quality', icon: <Book className="h-4 w-4" /> },
    { id: 'alerts', name: 'Alerts & Notifications', icon: <Book className="h-4 w-4" /> },
    { id: 'admin', name: 'Admin & Settings', icon: <Book className="h-4 w-4" /> },
  ];
  
  const popularArticles = [
    { id: 1, title: 'Getting Started with OmniSight', category: 'getting-started', views: 1243 },
    { id: 2, title: 'Creating Your First Dashboard', category: 'dashboards', views: 958 },
    { id: 3, title: 'Setting Up Data Quality Alerts', category: 'data-quality', views: 876 },
    { id: 4, title: 'Connecting to Third-Party Data Sources', category: 'integrations', views: 754 },
    { id: 5, title: 'Understanding the AI Assistant', category: 'getting-started', views: 721 },
  ];
  
  const recentArticles = [
    { id: 6, title: 'Using Advanced Filtering Options', category: 'dashboards', date: '2 days ago' },
    { id: 7, title: 'Export Options Overview', category: 'dashboards', date: '3 days ago' },
    { id: 8, title: 'Managing User Access Controls', category: 'admin', date: '5 days ago' },
    { id: 9, title: 'Setting Up Custom Alerts', category: 'alerts', date: '1 week ago' },
    { id: 10, title: 'Data Lineage Tracking', category: 'data-quality', date: '1 week ago' },
  ];
  
  const faqData = [
    { 
      id: 'faq-1', 
      question: 'How do I create a custom dashboard?', 
      answer: 'To create a custom dashboard, navigate to the Dashboards section and click on "Create New." You can then select from templates or start with a blank canvas. Add widgets by clicking the "+" button and configure them as needed.' 
    },
    { 
      id: 'faq-2', 
      question: 'How can I share my dashboards with team members?', 
      answer: 'You can share dashboards by clicking the "Share" button in the dashboard view. You can then add team members by email and set their permission level (viewer, editor, or admin).' 
    },
    { 
      id: 'faq-3', 
      question: 'What data sources can I connect to?', 
      answer: 'OmniSight supports a wide range of data sources including SQL databases, CSV files, Google Analytics, Salesforce, Hubspot, and many more. Go to Integrations to see the full list and set up new connections.' 
    },
    { 
      id: 'faq-4', 
      question: 'How do I set up automated reports?', 
      answer: 'To set up automated reports, go to the Reports section, create or select a report, then click "Schedule" to set up the frequency, format, and recipients. You can schedule daily, weekly, or monthly deliveries.' 
    },
    { 
      id: 'faq-5', 
      question: 'Can I export data from OmniSight?', 
      answer: 'Yes, you can export data in various formats including PDF, Excel, CSV, and PowerPoint. Look for the Export button in the dashboard or report view, or use the Advanced Export Options for more flexibility.' 
    },
  ];
  
  const filteredArticles = [...popularArticles, ...recentArticles].filter(
    article => article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Knowledge Base
          </CardTitle>
          <CardDescription>
            Find articles, tutorials, and answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search the knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="articles">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="mt-6">
              {searchQuery ? (
                <>
                  <h3 className="text-lg font-medium mb-4">Search Results</h3>
                  {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredArticles.map(article => (
                        <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Category: {categories.find(c => c.id === article.category)?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No articles found matching "{searchQuery}"</p>
                      <Button variant="outline" className="mt-2" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Popular Articles</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {popularArticles.map(article => (
                        <div 
                          key={article.id} 
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <h4 className="font-medium">{article.title}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              Category: {categories.find(c => c.id === article.category)?.name}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {article.views} views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recently Added</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {recentArticles.map(article => (
                        <div 
                          key={article.id} 
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <h4 className="font-medium">{article.title}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              Category: {categories.find(c => c.id === article.category)?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Added {article.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium">Getting Started with OmniSight</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A comprehensive guide to setting up your first dashboard
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">12:34 • 1,234 views</p>
                      <Button variant="ghost" size="sm">
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium">Advanced Data Visualization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn how to create complex visualizations for your data
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">18:45 • 987 views</p>
                      <Button variant="ghost" size="sm">
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium">Setting Up Integrations</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect your data sources to OmniSight
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">14:22 • 756 views</p>
                      <Button variant="ghost" size="sm">
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium">User Management & Permissions</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn how to manage users and set permissions
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">09:15 • 543 views</p>
                      <Button variant="ghost" size="sm">
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map(faq => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Still have questions?
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact our support team or submit a feature request through the feedback system.
                </p>
                <div className="mt-3">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
