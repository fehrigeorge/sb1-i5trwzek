import { useState, useRef, useEffect, PropsWithChildren } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { useAppearance } from '@/stores/appearance';

const MIN_WIDTH = 80;
const MAX_WIDTH = 384;
const DEFAULT_WIDTH = 320;
const SNAP_THRESHOLD = 200;

export function ResizableSidebar({ children }: PropsWithChildren) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isCollapsed = width <= MIN_WIDTH;
  const { animations, glassFactor, blurStrength } = useAppearance();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (width < SNAP_THRESHOLD) {
        setWidth(MIN_WIDTH);
      } else if (width < DEFAULT_WIDTH) {
        setWidth(DEFAULT_WIDTH);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, width]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative flex-shrink-0 border-r border-gray-800/50",
        animations ? "transition-all duration-300 ease-in-out" : "transition-none",
        isResizing && "select-none",
        "group/sidebar"
      )}
      style={{ width }}
    >
      {/* Resize handle */}
      <div 
        className={cn(
          "absolute inset-y-0 right-0 w-1 cursor-col-resize",
          "hover:bg-blue-500/20 group/handle",
          isResizing && "bg-blue-500/40"
        )}
        onMouseDown={() => setIsResizing(true)}
      >
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 right-0",
          "w-4 h-8 rounded-l bg-gray-800/80 opacity-0",
          "group-hover/handle:opacity-100 flex items-center justify-center",
          animations ? "transition-opacity duration-200" : "transition-none"
        )}>
          <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "h-full",
        isCollapsed ? "overflow-hidden" : "overflow-auto",
        animations ? "transition-all duration-300" : "transition-none"
      )}>
        {children}
      </div>

      {/* Expand/Collapse Controls */}
      <div className={cn(
        "absolute right-2 top-2 z-10",
        "flex items-center gap-2",
        isCollapsed ? "opacity-0" : "opacity-100",
        animations ? "transition-opacity duration-200" : "transition-none"
      )}>
        <button
          onClick={() => setWidth(MIN_WIDTH)}
          className={cn(
            "p-1.5 rounded-lg",
            "bg-gray-800/80 text-gray-400",
            "hover:bg-gray-700/80 hover:text-gray-300",
            animations ? "transition-all duration-200" : "transition-none"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Expand Button (Visible when collapsed) */}
      {isCollapsed && (
        <button
          onClick={() => setWidth(DEFAULT_WIDTH)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            "absolute inset-x-0 top-2 z-10",
            "flex items-center justify-center",
            "p-1.5 mx-2 rounded-lg",
            "bg-gray-800/80 text-gray-400",
            "hover:bg-gray-700/80 hover:text-gray-300",
            "group/expand",
            animations ? "transition-all duration-200" : "transition-none"
          )}
        >
          <ChevronRight className="w-4 h-4" />
          
          {/* Tooltip */}
          {showTooltip && (
            <div 
              className={cn(
                "absolute left-full ml-2",
                "px-2 py-1 rounded-md",
                "text-sm text-gray-200 whitespace-nowrap",
                "border border-gray-700/50",
                animations ? "animate-in fade-in slide-in-from-left-1 duration-200" : "",
                "z-50"
              )}
              style={{
                backgroundColor: `rgba(17, 24, 39, ${glassFactor * 0.95}%)`,
                backdropFilter: `blur(${blurStrength * 0.5}px)`,
              }}
            >
              Expand sidebar
            </div>
          )}
        </button>
      )}
    </aside>
  );
}