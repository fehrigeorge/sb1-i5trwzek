import { Lock } from 'lucide-react';
import { cn } from '@/shared/helpers';

interface PinStatusIndicatorProps {
  isProtected: boolean;
  className?: string;
}

export function PinStatusIndicator({ isProtected, className }: PinStatusIndicatorProps) {
  if (!isProtected) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Lock className="w-3.5 h-3.5" />
      <span>PIN Protected</span>
    </div>
  );
}