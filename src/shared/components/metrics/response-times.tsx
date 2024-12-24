```tsx
import { Clock } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

interface ResponseTimesProps {
  average: number;
  fastest: number;
  slowest: number;
}

export function ResponseTimes({ average, fastest, slowest }: ResponseTimesProps) {
  return (
    <GlassPanel className="p-6" intensity="low">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-medium text-gray-200">Response Times</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-100">{average}m</div>
            <div className="text-sm text-gray-400">Average</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-green-400">{fastest}m</div>
            <div className="text-sm text-gray-400">Fastest</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-yellow-400">{slowest}m</div>
            <div className="text-sm text-gray-400">Slowest</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
```