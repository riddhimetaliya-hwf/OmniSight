
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Filter, 
  MoreHorizontal, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';
import { CostItem } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ServiceCostTableProps {
  costItems: CostItem[];
}

type SortField = 'serviceName' | 'cost' | 'budget' | 'department' | 'category' | 'trend';
type SortDirection = 'asc' | 'desc';

const ServiceCostTable: React.FC<ServiceCostTableProps> = ({ costItems }) => {
  const [sortField, setSortField] = useState<SortField>('cost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedItems = [...costItems].sort((a, b) => {
    if (sortField === 'serviceName' || sortField === 'department' || sortField === 'category') {
      return sortDirection === 'asc' 
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'infrastructure':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{category}</Badge>;
      case 'saas':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{category}</Badge>;
      case 'services':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{category}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{category}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Database className="mr-2 h-5 w-5 text-muted-foreground" />
            IT Services Cost Breakdown
          </CardTitle>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('serviceName')}
                >
                  <div className="flex items-center">
                    Service Name
                    {sortField === 'serviceName' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('cost')}
                >
                  <div className="flex items-center">
                    Cost
                    {sortField === 'cost' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('budget')}
                >
                  <div className="flex items-center">
                    Budget
                    {sortField === 'budget' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department
                    {sortField === 'department' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('trend')}
                >
                  <div className="flex items-center">
                    Trend
                    {sortField === 'trend' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                <TableHead className="w-10">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{item.serviceName}</TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell>{formatCurrency(item.budget)}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{getCategoryBadge(item.category)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${item.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {item.trend > 0 ? 
                        <TrendingUp className="h-4 w-4 mr-1" /> : 
                        <TrendingDown className="h-4 w-4 mr-1" />
                      }
                      <span>{Math.abs(item.trend).toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Analyze Trends</DropdownMenuItem>
                        <DropdownMenuItem>Optimize Costs</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCostTable;
