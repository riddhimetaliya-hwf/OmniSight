
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ui/theme-provider";
import { useUserPrefs } from '../context/UserPrefsContext';
import { Sun, Moon, Monitor, Palette, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SmartTooltip } from "@/components/OmniGuide";

const AppearanceSettings: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const { preferences, updateThemeMode, updateThemeColor, updatePreferences } = useUserPrefs();

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
    updateThemeMode(value);
  };

  const handleColorChange = (value: string) => {
    updateThemeColor(value as any);
  };
  
  const handleHighContrastChange = (checked: boolean) => {
    updatePreferences({
      highContrast: checked
    });
    
    // Apply high contrast mode to the document
    if (checked) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };
  
  const handleAnimationsChange = (checked: boolean) => {
    updatePreferences({
      animations: checked
    });
    
    // Apply reduced motion preference
    if (!checked) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };
  
  const handleFontSizeChange = (value: number[]) => {
    const fontSizeMap: Record<number, 'small' | 'medium' | 'large'> = {
      0: 'small',
      1: 'medium',
      2: 'large'
    };
    
    updatePreferences({
      fontSize: fontSizeMap[value[0]]
    });
    
    // Apply font size to document
    document.documentElement.dataset.fontSize = fontSizeMap[value[0]];
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-omni shadow-omni-card">
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Theme Mode</h3>
            </div>
            
            <RadioGroup 
              value={theme} 
              onValueChange={handleThemeChange as any}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  Light
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  Dark
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Theme Color</h3>
            </div>
            
            <RadioGroup 
              value={preferences.colorScheme}
              onValueChange={handleColorChange}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default-color" />
                <Label htmlFor="default-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    Default
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blue" id="blue-color" />
                <Label htmlFor="blue-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-omni-electric-blue"></div>
                    Blue
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purple" id="purple-color" />
                <Label htmlFor="purple-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    Purple
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="green-color" />
                <Label htmlFor="green-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-omni-emerald"></div>
                    Green
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orange" id="orange-color" />
                <Label htmlFor="orange-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    Orange
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accent" id="accent-color" />
                <Label htmlFor="accent-color" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-omni-accent-from to-omni-accent-to"></div>
                    Accent
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-omni shadow-omni-card">
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SmartTooltip
            tooltipId="high-contrast-setting"
            title="High Contrast Mode"
            content="Increases contrast between elements for better visibility"
            placement="right"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="high-contrast" className="font-medium">High Contrast Mode</Label>
              </div>
              <Switch 
                id="high-contrast" 
                checked={preferences.highContrast || false}
                onCheckedChange={handleHighContrastChange}
                aria-label="Toggle high contrast mode"
              />
            </div>
          </SmartTooltip>
          
          <SmartTooltip
            tooltipId="animation-setting"
            title="Animations"
            content="Enable or disable animations throughout the platform"
            placement="right"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="animations" className="font-medium">Enable Animations</Label>
              </div>
              <Switch 
                id="animations" 
                checked={preferences.animations !== false}
                onCheckedChange={handleAnimationsChange}
                aria-label="Toggle animations"
              />
            </div>
          </SmartTooltip>
          
          <SmartTooltip
            tooltipId="font-size-setting"
            title="Font Size"
            content="Adjust the text size throughout the platform"
            placement="right"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  id="font-size"
                  max={2}
                  step={1}
                  value={[preferences.fontSize === 'small' ? 0 : preferences.fontSize === 'medium' ? 1 : 2]}
                  onValueChange={handleFontSizeChange}
                  className="flex-1"
                  aria-label="Adjust font size"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground px-2">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>
          </SmartTooltip>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
