import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { useState } from 'react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  tooltip: string;
  children?: React.ReactNode;
}

export function ToolbarButton({
  icon: Icon,
  isActive,
  onClick,
  tooltip,
  children
}: ToolbarButtonProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          onClick();
          setShowContent(!showContent);
        }}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isActive 
            ? "bg-blue-500/10 text-blue-500" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        )}
        title={tooltip}
      >
        <Icon className="w-5 h-5" />
      </button>

      {showContent && children && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowContent(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50">
            {children}
          </div>
        </>
      )}
    </div>
  );
}