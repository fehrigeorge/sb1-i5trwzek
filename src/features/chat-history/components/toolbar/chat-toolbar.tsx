import { Star, Calendar, ArrowUpDown } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { DateRangePicker } from './date-range-picker';
import { useChatFilters } from '../../hooks/use-chat-filters';
import { ToolbarButton } from './toolbar-button';

export function ChatToolbar() {
  const { 
    showFavorites,
    sortOrder,
    dateRange,
    toggleFavorites,
    toggleSortOrder,
    setDateRange 
  } = useChatFilters();

  return (
    <div className="sticky top-0 z-10 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
      <div className="flex items-center gap-2">
        <ToolbarButton
          icon={Star}
          isActive={showFavorites}
          onClick={toggleFavorites}
          tooltip="Show favorites only"
        />

        <ToolbarButton
          icon={ArrowUpDown}
          isActive={sortOrder === 'desc'}
          onClick={toggleSortOrder}
          tooltip={sortOrder === 'asc' ? 'Newest first' : 'Oldest first'}
        />

        <ToolbarButton
          icon={Calendar}
          isActive={!!dateRange}
          onClick={() => setDateRange(null)}
          tooltip="Select date range"
        >
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </ToolbarButton>

        {dateRange && (
          <div className="ml-2 text-sm text-gray-500">
            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}