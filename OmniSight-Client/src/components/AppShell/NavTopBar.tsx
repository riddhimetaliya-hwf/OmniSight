import React from "react";
import { Bell, Settings, Shield, User, ChevronDown, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AICommandCenter from "@/components/AICommandCenter/AICommandCenter";
import { OmniGuideProvider } from "@/components/OmniGuide";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { DemoActionButton, DemoProvider } from "@/components/DemoEngine";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SmartTooltip } from "@/components/OmniGuide";

const NavTopBar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return null;
};

export default NavTopBar;
