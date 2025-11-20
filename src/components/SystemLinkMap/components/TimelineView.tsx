import React from 'react';
import { TimelineEvent, SystemNode } from '../types';

interface TimelineViewProps {
  events: TimelineEvent[];
  systems: SystemNode[];
  onEventClick: (event: TimelineEvent) => void;
}

const getSystemLabel = (systems: SystemNode[], id: string) => {
  const sys = systems.find(s => s.id === id);
  return sys ? sys.label : id;
};

const impactColor = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const TimelineView: React.FC<TimelineViewProps> = ({ events, systems, onEventClick }) => {
  // Sort events by timestamp descending
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="w-full h-full p-6 bg-gradient-to-br from-blue-50 to-purple-50 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">System Timeline</h3>
      <div className="relative border-l-2 border-blue-200 ml-6">
        {sortedEvents.map((event, idx) => (
          <div key={event.id} className="mb-8 ml-4 flex items-start group cursor-pointer" onClick={() => onEventClick(event)}>
            <div className="absolute -left-3.5 mt-1 w-7 h-7 rounded-full flex items-center justify-center bg-white border-2 border-blue-400 group-hover:bg-blue-100">
              <span className="text-xs font-bold capitalize text-blue-600">{event.type[0]}</span>
            </div>
            <div className="ml-8">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base">{event.title}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColor[event.impact]}`}>{event.impact} impact</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getSystemLabel(systems, event.systemId)} &middot; {new Date(event.timestamp).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView; 