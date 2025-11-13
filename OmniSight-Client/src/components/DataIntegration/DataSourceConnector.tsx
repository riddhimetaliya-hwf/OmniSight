
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database, ExternalLink, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type DataSourceType = "crm" | "marketing" | "sales" | "finance" | "custom";

interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: "connected" | "disconnected" | "pending";
  lastSync?: Date;
}

export const DataSourceConnector: React.FC = () => {
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: "salesforce", name: "Salesforce", type: "crm", status: "disconnected" },
    { id: "hubspot", name: "HubSpot", type: "marketing", status: "disconnected" },
    { id: "googleanalytics", name: "Google Analytics", type: "marketing", status: "disconnected" },
    { id: "quickbooks", name: "QuickBooks", type: "finance", status: "disconnected" },
    { id: "mailchimp", name: "Mailchimp", type: "marketing", status: "disconnected" },
  ]);
  
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [connecting, setConnecting] = useState<boolean>(false);

  const handleConnect = (sourceId: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to connect",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setDataSources(prev => 
        prev.map(source => 
          source.id === sourceId 
            ? { ...source, status: "connected", lastSync: new Date() } 
            : source
        )
      );
      
      setApiKey("");
      setConnecting(false);
      
      toast({
        title: "Data Source Connected",
        description: `Successfully connected to ${dataSources.find(s => s.id === sourceId)?.name}`,
      });
    }, 1500);
  };

  const handleDisconnect = (sourceId: string) => {
    setDataSources(prev => 
      prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: "disconnected", lastSync: undefined } 
          : source
      )
    );
    
    toast({
      title: "Data Source Disconnected",
      description: `Successfully disconnected from ${dataSources.find(s => s.id === sourceId)?.name}`,
    });
  };

  const syncData = (sourceId: string) => {
    const sourceName = dataSources.find(s => s.id === sourceId)?.name;
    
    toast({
      title: "Syncing Data",
      description: `Starting data sync with ${sourceName}...`,
    });
    
    // Simulate sync process
    setTimeout(() => {
      setDataSources(prev => 
        prev.map(source => 
          source.id === sourceId 
            ? { ...source, lastSync: new Date() } 
            : source
        )
      );
      
      toast({
        title: "Sync Complete",
        description: `Data from ${sourceName} has been refreshed`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Data Sources
          </CardTitle>
          <CardDescription>
            Connect external data sources to enhance your dashboards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map(source => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input 
                  placeholder="API Key / Access Token" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  type="password"
                />
              </div>
              <Button 
                onClick={() => handleConnect(selectedSource)}
                disabled={!selectedSource || connecting}
              >
                {connecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4">
        {dataSources.map(source => (
          <Card key={source.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{source.name}</CardTitle>
                  <Badge variant={source.status === "connected" ? "default" : "outline"}>
                    {source.status === "connected" ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Disconnected
                      </span>
                    )}
                  </Badge>
                </div>
                <Badge variant="outline">{source.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {source.status === "connected" && source.lastSync && (
                <p className="text-sm text-muted-foreground">
                  Last synced: {source.lastSync.toLocaleString()}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              {source.status === "connected" ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => syncData(source.id)}>
                    Sync Now
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDisconnect(source.id)}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedSource(source.id);
                    // Scroll to top connect form
                    document.querySelector('.data-source-connector')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Connect
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataSourceConnector;
