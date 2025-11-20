
import React from "react";
import { Card } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  format?: "text" | "chart" | "table";
  data?: any;
}

interface AIResponseProps {
  message: Message;
}

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const mockTableData = [
  { id: 1, product: 'Widget A', sales: 145, growth: '+12%' },
  { id: 2, product: 'Widget B', sales: 232, growth: '+5%' },
  { id: 3, product: 'Widget C', sales: 98, growth: '-3%' },
];

const AIResponse: React.FC<AIResponseProps> = ({ message }) => {
  // For demo purposes, let's determine format based on message content
  let format = message.format;
  if (!format) {
    if (message.content.toLowerCase().includes('chart') || message.content.toLowerCase().includes('graph')) {
      format = 'chart';
    } else if (message.content.toLowerCase().includes('table') || message.content.toLowerCase().includes('list')) {
      format = 'table';
    } else {
      format = 'text';
    }
  }

  if (message.role === "user") {
    return (
      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-3 rounded-lg max-w-[80%] break-words">
        {message.content}
      </div>
    );
  }

  return (
    <Card className="p-3 max-w-[80%] dark:bg-gray-800">
      {format === 'text' && (
        <p className="text-sm">{message.content}</p>
      )}
      
      {format === 'chart' && (
        <div className="space-y-2">
          <p className="text-sm">{message.content}</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={message.data || mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {format === 'table' && (
        <div className="space-y-2">
          <p className="text-sm">{message.content}</p>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(message.data || mockTableData).map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{row.sales}</TableCell>
                    <TableCell>{row.growth}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      <div className="text-xs text-right mt-1 text-gray-400">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </Card>
  );
};

export default AIResponse;
