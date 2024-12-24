import { useState } from 'react';
import { Star, Calendar, ArrowUpDown } from 'lucide-react';
import { cn } from '@/shared/helpers';
import { DateRangePicker } from './date-range-picker';
import { useChatFilters } from '@/hooks/use-chat-filters';

export function ChatToolbar() {
  const [showDatePicker, setShowDatePicker] = useState(false);
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
        <button
          onClick={toggleFavorites}
          className={cn(
            "p-2 rounded-lg transition-colors",
            showFavorites 
              ? "bg-yellow-500/10 text-yellow-500" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          )}
          title="Show favorites only"
        >
          <Star className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSortOrder}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          )}
          title={sortOrder === 'asc' ? 'Newest first' : 'Oldest first'}
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowDatePicker(true)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            dateRange 
              ? "bg-blue-500/10 text-blue-500" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          )}
          title="Select date range"
        >
          <Calendar className="w-5 h-5" />
        </button>

        {dateRange && (
          <div className="ml-2 text-sm text-gray-500">
            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
          </div>
        )}
      </div>

      {showDatePicker && (
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}