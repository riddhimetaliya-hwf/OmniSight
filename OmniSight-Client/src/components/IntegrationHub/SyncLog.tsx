
import React from "react";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  integration: string;
  event: string;
  status: string;
  items: string;
  statusClass: string;
}

const SyncLog: React.FC = () => {
  const logEntries: LogEntry[] = [
    {
      timestamp: "2023-06-10T16:45:00Z",
      integration: "Outlook",
      event: "Email Sync",
      status: "In Progress",
      items: "42",
      statusClass: "text-blue-500",
    },
    {
      timestamp: "2023-06-10T16:30:00Z",
      integration: "Salesforce",
      event: "Contact Update",
      status: "Completed",
      items: "156",
      statusClass: "text-green-500",
    },
    {
      timestamp: "2023-06-10T16:15:00Z",
      integration: "Google Drive",
      event: "File Transfer",
      status: "Failed",
      items: "17",
      statusClass: "text-red-500",
    },
    {
      timestamp: "2023-06-10T16:00:00Z",
      integration: "Salesforce",
      event: "Lead Import",
      status: "Completed",
      items: "83",
      statusClass: "text-green-500",
    },
    {
      timestamp: "2023-06-10T15:45:00Z",
      integration: "Microsoft Teams",
      event: "Message Sync",
      status: "Completed",
      items: "247",
      statusClass: "text-green-500",
    },
  ];

  return (
    <section className="glass-container p-8 max-w-full overflow-hidden animate-fade-up" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="chip bg-blue-100 text-apple-blue mb-2">Real-time Updates</div>
          <h2 className="text-xl font-medium">Synchronization Log</h2>
          <p className="text-apple-gray mt-1">Recent data synchronization activities across your connected systems</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button className="btn-apple-secondary text-xs py-1.5 px-3">Export</button>
          <button className="btn-apple-secondary text-xs py-1.5 px-3">Filter</button>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                Integration
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                Event
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                Items
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {logEntries.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 whitespace-nowrap text-sm text-apple-gray">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  {log.integration}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  {log.event}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  <span className={cn("font-medium", log.statusClass)}>
                    {log.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  {log.items}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button className="text-sm text-apple-blue hover:underline focus:outline-none">
          View all activities
        </button>
      </div>
    </section>
  );
};

export default SyncLog;
