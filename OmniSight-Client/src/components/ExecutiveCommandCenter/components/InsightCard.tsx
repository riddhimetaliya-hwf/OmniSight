
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart,
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InsightCategory } from '../data/insightsData';

interface InsightCardProps {
  title: string;
  description: string;
  category: InsightCategory;
  date: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title,
  description,
  category,
  date 
}) => {
  const getCategoryStyles = () => {
    switch (category) {
      case 'growth':
        return { 
          icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
          bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
        };
      case 'risk':
        return { 
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-400',
          badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50'
        };
      case 'opportunity':
        return { 
          icon: <Zap className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-400',
          badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'
        };
      case 'performance':
        return { 
          icon: <BarChart className="h-5 w-5 text-violet-500" />,
          bgColor: 'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
          borderColor: 'border-violet-200 dark:border-violet-800',
          textColor: 'text-violet-700 dark:text-violet-400',
          badgeColor: 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800/50'
        };
      case 'trend':
        return { 
          icon: <TrendingDown className="h-5 w-5 text-amber-500" />,
          bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          textColor: 'text-amber-700 dark:text-amber-400',
          badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
        };
      default:
        return { 
          icon: <TrendingUp className="h-5 w-5 text-gray-500" />,
          bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-700 dark:text-gray-400',
          badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700/50'
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <Card className={`shadow-md hover:shadow-lg transition-all border ${styles.borderColor} overflow-hidden`}>
      <div className={`h-1 w-full ${styles.bgColor}`}></div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${styles.bgColor}`}>
              {styles.icon}
            </div>
            <Badge 
              variant="outline" 
              className={`capitalize ${styles.badgeColor}`}
            >
              {category}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        
        <h3 className={`font-semibold text-lg mb-2 ${styles.textColor}`}>{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`p-0 h-auto ${styles.textColor} hover:bg-transparent hover:underline`}
        >
          <span>View details</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
