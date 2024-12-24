import { cn } from '@/shared/helpers';

interface MessageCountBadgeProps {
  count: number;
  className?: string;
}

export function MessageCountBadge({ count, className }: MessageCountBadgeProps) {
  if (count === 0) return null;

  return (
    <span 
      className={cn(
        "px-1.5 py-0.5 text-xs font-medium rounded-full",
        "bg-blue-500/20 text-blue-400",
        className
      )}
    >
      {count > 999 ? '999+' : count}
    </span>
  );
}