import { Calendar } from '@/components/ui/calendar';
import { DateRange } from '@/types/filters';
import { X } from 'lucide-react';

interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
  onClose: () => void;
}

export function DateRangePicker({ value, onChange, onClose }: DateRangePickerProps) {
  return (
    <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Select Date Range</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Calendar
        mode="range"
        selected={value}
        onSelect={onChange}
        numberOfMonths={2}
        className="rounded-md border dark:border-gray-800"
      />

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onChange(null)}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-600"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>
  );
}