
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ReportBranding } from "./types";
import { Image, Droplet } from "lucide-react";

interface ReportBrandingOptionsProps {
  branding: ReportBranding;
  onBrandingChange: (
    useLogo: boolean,
    useWatermark: boolean,
    primaryColor: string,
    logoUrl: string
  ) => void;
}

const ReportBrandingOptions: React.FC<ReportBrandingOptionsProps> = ({
  branding,
  onBrandingChange
}) => {
  const handleLogoToggle = (value: boolean) => {
    onBrandingChange(value, branding.useWatermark, branding.primaryColor, branding.logoUrl);
  };

  const handleWatermarkToggle = (value: boolean) => {
    onBrandingChange(branding.useLogo, value, branding.primaryColor, branding.logoUrl);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onBrandingChange(branding.useLogo, branding.useWatermark, event.target.value, branding.logoUrl);
  };

  const handleLogoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onBrandingChange(branding.useLogo, branding.useWatermark, branding.primaryColor, event.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  Include Company Logo
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add your company logo to the report header
                </p>
              </div>
              <Switch
                checked={branding.useLogo}
                onCheckedChange={handleLogoToggle}
              />
            </div>
            
            {branding.useLogo && (
              <div className="space-y-2 pl-6">
                <Label>Logo URL</Label>
                <Input
                  placeholder="https://your-company.com/logo.png"
                  value={branding.logoUrl}
                  onChange={handleLogoUrlChange}
                />
                {branding.logoUrl && (
                  <div className="mt-2 p-2 border rounded-md bg-muted/50 max-w-40">
                    <img
                      src={branding.logoUrl}
                      alt="Company logo preview"
                      className="max-h-12 object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/200x80?text=Invalid+Image";
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Droplet className="mr-2 h-4 w-4" />
                  Add Watermark
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add a subtle company watermark to each page
                </p>
              </div>
              <Switch
                checked={branding.useWatermark}
                onCheckedChange={handleWatermarkToggle}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.primaryColor}
                  onChange={handleColorChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={handleColorChange}
                  className="font-mono"
                />
              </div>
              <div 
                className="h-8 rounded-md mt-2" 
                style={{ backgroundColor: branding.primaryColor }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportBrandingOptions;
