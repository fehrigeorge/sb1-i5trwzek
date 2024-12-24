import { Clock, Zap } from 'lucide-react';

interface ActivityPatternsProps {
  busiestsHour: { hour: string; count: number };
  quietestHour: { hour: string; count: number };
  messageFrequency: number;
  conversationLength: number;
}

export function ActivityPatterns({ 
  busiestsHour, 
  quietestHour, 
  messageFrequency,
  conversationLength 
}: ActivityPatternsProps) {
  const hours = Math.floor(conversationLength / 60);
  const minutes = conversationLength % 60;

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-800/50">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-medium text-gray-200">Activity Patterns</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Most Active Hour</div>
            <div className="text-xl font-semibold text-gray-100">{busiestsHour.hour}</div>
            <div className="text-sm text-gray-500">{busiestsHour.count} messages</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-1">Least Active Hour</div>
            <div className="text-xl font-semibold text-gray-100">{quietestHour.hour}</div>
            <div className="text-sm text-gray-500">{quietestHour.count} messages</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Message Frequency</div>
            <div className="text-xl font-semibold text-gray-100">
              {messageFrequency} msg/hr
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-1">Conversation Length</div>
            <div className="text-xl font-semibold text-gray-100">
              {hours}h {minutes}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}