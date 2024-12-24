import { Search, X } from 'lucide-react';
import { cn } from '@/shared/helpers';

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  resultsCount?: number;
  onClear?: () => void;
  className?: string;
}

export function ChatSearch({
  value,
  onChange,
  isLoading,
  resultsCount,
  onClear,
  className,
}: ChatSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search messages..."
        className="w-full pl-9 pr-12 py-2 bg-gray-900/50 border border-gray-800/50 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        )}
        {resultsCount !== undefined && !isLoading && (
          <span className="text-xs text-gray-400">
            {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
          </span>
        )}
        {value && (
          <button
            onClick={onClear}
            className="p-1 rounded-md hover:bg-gray-800/50"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}
