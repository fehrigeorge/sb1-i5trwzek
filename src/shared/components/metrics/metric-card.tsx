```tsx
import { cn } from '@/shared/helpers';
import { GlassPanel } from '@/components/ui/glass-panel';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, value, trend, icon, className }: MetricCardProps) {
  return (
    <GlassPanel className={cn("p-6", className)} intensity="low">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-semibold text-gray-100">{value}</p>
          {trend !== undefined && (
            <span className={cn(
              "text-sm font-medium",
              trend > 0 ? "text-green-400" : "text-red-400"
            )}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
```