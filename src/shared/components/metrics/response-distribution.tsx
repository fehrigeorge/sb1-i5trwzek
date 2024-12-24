```tsx
import { Timer } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

interface ResponseDistributionProps {
  distribution: {
    fast: number;
    medium: number;
    slow: number;
  };
}

export function ResponseDistribution({ distribution }: ResponseDistributionProps) {
  const total = distribution.fast + distribution.medium + distribution.slow;
  const getPercentage = (value: number) => Math.round((value / total) * 100);

  return (
    <GlassPanel className="p-6" intensity="low">
      <div className="flex items-center gap-2 mb-6">
        <Timer className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-medium text-gray-200">Response Time Distribution</h3>
      </div>

      <div className="space-y-4">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500/80 h-full transition-all duration-500"
            style={{ width: `${getPercentage(distribution.fast)}%` }}
          />
          <div 
            className="bg-yellow-500/80 h-full transition-all duration-500"
            style={{ width: `${getPercentage(distribution.medium)}%` }}
          />
          <div 
            className="bg-red-500/80 h-full transition-all duration-500"
            style={{ width: `${getPercentage(distribution.slow)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-400">
              {getPercentage(distribution.fast)}%
            </div>
            <div className="text-sm text-gray-400">Fast (&lt;1m)</div>
            <div className="text-xs text-gray-500 mt-1">{distribution.fast} responses</div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-yellow-400">
              {getPercentage(distribution.medium)}%
            </div>
            <div className="text-sm text-gray-400">Medium (1-5m)</div>
            <div className="text-xs text-gray-500 mt-1">{distribution.medium} responses</div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-red-400">
              {getPercentage(distribution.slow)}%
            </div>
            <div className="text-sm text-gray-400">Slow (&gt;5m)</div>
            <div className="text-xs text-gray-500 mt-1">{distribution.slow} responses</div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
```