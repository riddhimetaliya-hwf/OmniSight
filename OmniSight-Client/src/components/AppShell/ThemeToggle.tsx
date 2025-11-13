
import React, { useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const ThemeToggle: React.FC = () => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const colorOptions = [
    { value: "default", label: "Default" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "green", label: "Green" },
    { value: "orange", label: "Orange" },
    { value: "accent", label: "Accent" },
  ];

  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 rounded-full p-0"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      
      <DropdownMenu open={isColorMenuOpen} onOpenChange={setIsColorMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 rounded-full p-0"
            aria-label="Change color scheme"
          >
            <Palette className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colorOptions.map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => setColorScheme(option.value as any)}
              className={colorScheme === option.value ? "bg-primary/10" : ""}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  option.value === "default" ? "bg-primary" : 
                  option.value === "blue" ? "bg-blue-500" : 
                  option.value === "purple" ? "bg-purple-500" : 
                  option.value === "green" ? "bg-green-500" : 
                  option.value === "orange" ? "bg-orange-500" : 
                  "bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"
                }`}></div>
                {option.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeToggle;
