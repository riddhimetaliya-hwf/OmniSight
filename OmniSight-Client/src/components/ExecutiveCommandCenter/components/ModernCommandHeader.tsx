import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mic, 
  MicOff, 
  Settings, 
  Layout, 
  Zap, 
  Sparkles,
  LayoutGrid,
  Layers,
  Volume2,
  Bell,
  Activity
} from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import { ExecutiveRole } from '@/types/executive-roles';

interface ModernCommandHeaderProps {
  activeRole: ExecutiveRole;
  onRoleChange: (role: ExecutiveRole) => void;
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
  layoutMode: 'compact' | 'comfortable' | 'spacious';
  onLayoutChange: (mode: 'compact' | 'comfortable' | 'spacious') => void;
}

const ModernCommandHeader: React.FC<ModernCommandHeaderProps> = ({
  activeRole,
  onRoleChange,
  voiceEnabled,
  onVoiceToggle,
  layoutMode,
  onLayoutChange
}) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-5 glass-effect rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-r from-white/5 to-white/10">
      {/* Left Section - Logo and Title */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-lg"></div>
          <div className="relative p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-white/10">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            Executive Command Center
            {voiceEnabled && <Activity className="h-5 w-5 text-purple-500 animate-pulse" />}
          </h1>
          <p className="text-sm text-black/70">Intelligent business intelligence platform</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-black border-green-500/30 px-3 py-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          Live Data
        </Badge>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-4">
        {/* Voice Control - Enhanced */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20">
          <Button
            variant={voiceEnabled ? "default" : "ghost"}
            size="sm"
            onClick={() => onVoiceToggle(!voiceEnabled)}
            className={`gap-2 transition-all duration-300 ${
              voiceEnabled 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl' 
                : 'hover:bg-white/20 text-black'
            }`}
          >
            {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span className="hidden sm:inline">Voice</span>
          </Button>
          {voiceEnabled && (
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:scale-105 hover:shadow-lg transition-all duration-300 text-black">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:scale-105 hover:shadow-lg transition-all duration-300 text-black">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {(['compact', 'comfortable', 'spacious'] as const).map((mode) => (
            <Button
              key={mode}
              variant={layoutMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => onLayoutChange(mode)}
              className={`transition-all duration-300 text-black ${
                layoutMode === mode 
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 shadow-lg shadow-blue-500/25' 
                  : 'hover:bg-gradient-to-r hover:from-gray-500/20 hover:to-gray-600/20 hover:scale-105 hover:shadow-md'
              }`}
            >
              {mode === 'compact' && <LayoutGrid className="h-4 w-4" />}
              {mode === 'comfortable' && <Layout className="h-4 w-4" />}
              {mode === 'spacious' && <Layers className="h-4 w-4" />}
            </Button>
          ))}
        </div>

        {/* Role Switcher */}
        <RoleSwitcher activeRole={activeRole} onRoleChange={onRoleChange} />

        {/* Settings */}
        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-gray-500/20 hover:to-gray-600/20 hover:scale-105 hover:shadow-lg transition-all duration-300 text-black">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModernCommandHeader;
