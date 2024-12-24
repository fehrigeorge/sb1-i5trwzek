import { cn } from '@/shared/helpers';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gray-800/50 rounded",
        className
      )}
    />
  );
}