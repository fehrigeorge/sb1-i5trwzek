```tsx
import { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

interface EngagementChartProps {
  sent: number;
  received: number;
}

export function EngagementChart({ sent, received }: EngagementChartProps) {
  const total = sent + received;
  const sentPercentage = useMemo(() => 
    Math.round((sent / total) * 100), 
    [sent, total]
  );
  const receivedPercentage = useMemo(() => 
    Math.round((received / total) * 100),
    [received, total]
  );

  return (
    <GlassPanel className="p-6" intensity="low">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-medium text-gray-200">Engagement Distribution</h3>
        </div>
        
        <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-500/80 transition-all duration-500"
            style={{ width: `${sentPercentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Sent</span>
              <span className="text-sm font-medium text-gray-200">{sent}</span>
            </div>
            <div className="text-xs text-gray-500">{sentPercentage}% of total</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Received</span>
              <span className="text-sm font-medium text-gray-200">{received}</span>
            </div>
            <div className="text-xs text-gray-500">{receivedPercentage}% of total</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
```