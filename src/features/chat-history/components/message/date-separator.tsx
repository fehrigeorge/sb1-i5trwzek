import { formatFullDate } from '../../utils/date-formatting';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
        {formatFullDate(date)}
      </div>
    </div>
  );
}