import { Calendar } from '@/shared/components/ui/calendar';
import { X } from 'lucide-react';
import type { DateRange } from '../../types';

interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Select Date Range</h3>
        <button
          onClick={() => onChange(null)}
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
      </div>
    </div>
  );
}