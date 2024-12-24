```tsx
import { Zap } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

interface ActivityPatternsProps {
  busiestHour: { hour: string; count: number };
  quietestHour: { hour: string; count: number };
  messageFrequency: number;
  conversationLength: number;
}

export function ActivityPatterns({ 
  busiestHour, 
  quietestHour, 
  messageFrequency,
  conversationLength 
}: ActivityPatternsProps) {
  const hours = Math.floor(conversationLength / 60);
  const minutes = conversationLength % 60;

  return (
    <GlassPanel className="p-6" intensity="low">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-medium text-gray-200">Activity Patterns</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Most Active Hour</div>
            <div className="text-xl font-semibold text-gray-100">{busiestHour.hour}</div>
            <div className="text-sm text-gray-500">{busiestHour.count} messages</div>
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
    </GlassPanel>
  );
}
```