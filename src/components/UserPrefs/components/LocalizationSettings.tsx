
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPrefs } from '../context/UserPrefsContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { Globe, Calendar, Clock } from 'lucide-react';

interface DateFormatOption {
  value: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  label: string;
  example: string;
}

interface TimeFormatOption {
  value: '12h' | '24h';
  label: string;
  example: string;
}

interface LanguageOption {
  value: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
  label: string;
  nativeLabel: string;
}

const LocalizationSettings: React.FC = () => {
  const { preferences, updateLanguage, updateDateFormat, updateTimeFormat } = useUserPrefs();
  const now = new Date();

  const languages: LanguageOption[] = [
    { value: 'en', label: 'English', nativeLabel: 'English' },
    { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
    { value: 'fr', label: 'French', nativeLabel: 'Français' },
    { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
    { value: 'zh', label: 'Chinese', nativeLabel: '中文' },
    { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  ];

  const dateFormats: DateFormatOption[] = [
    { 
      value: 'MM/DD/YYYY', 
      label: 'MM/DD/YYYY', 
      example: format(now, 'MM/dd/yyyy')
    },
    { 
      value: 'DD/MM/YYYY', 
      label: 'DD/MM/YYYY', 
      example: format(now, 'dd/MM/yyyy')
    },
    { 
      value: 'YYYY-MM-DD', 
      label: 'YYYY-MM-DD', 
      example: format(now, 'yyyy-MM-dd')
    },
  ];

  const timeFormats: TimeFormatOption[] = [
    { 
      value: '12h', 
      label: '12 Hour', 
      example: format(now, 'h:mm a')
    },
    { 
      value: '24h', 
      label: '24 Hour', 
      example: format(now, 'HH:mm')
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-500" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={preferences.language} 
            onValueChange={(value) => updateLanguage(value as any)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {languages.map((language) => (
              <div key={language.value} className="flex items-center space-x-2">
                <RadioGroupItem value={language.value} id={`lang-${language.value}`} />
                <Label htmlFor={`lang-${language.value}`} className="cursor-pointer">
                  <div className="flex flex-col">
                    <span>{language.label}</span>
                    <span className="text-xs text-muted-foreground">{language.nativeLabel}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-500" />
            Date Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={preferences.dateFormat} 
            onValueChange={(value) => updateDateFormat(value as any)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {dateFormats.map((dateFormat) => (
              <div key={dateFormat.value} className="flex items-center space-x-2">
                <RadioGroupItem value={dateFormat.value} id={`date-${dateFormat.value}`} />
                <Label htmlFor={`date-${dateFormat.value}`} className="cursor-pointer">
                  <div className="flex flex-col">
                    <span>{dateFormat.label}</span>
                    <span className="text-xs text-muted-foreground">Example: {dateFormat.example}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-500" />
            Time Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={preferences.timeFormat} 
            onValueChange={(value) => updateTimeFormat(value as any)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {timeFormats.map((timeFormat) => (
              <div key={timeFormat.value} className="flex items-center space-x-2">
                <RadioGroupItem value={timeFormat.value} id={`time-${timeFormat.value}`} />
                <Label htmlFor={`time-${timeFormat.value}`} className="cursor-pointer">
                  <div className="flex flex-col">
                    <span>{timeFormat.label}</span>
                    <span className="text-xs text-muted-foreground">Example: {timeFormat.example}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalizationSettings;
