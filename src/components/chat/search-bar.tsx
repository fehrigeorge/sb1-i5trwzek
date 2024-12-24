import { Search } from 'lucide-react';
import { useSearchFocus } from '@/hooks/use-search-focus';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { searchRef } = useSearchFocus();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        ref={searchRef}
        type="text"
        placeholder="Search conversations... (/)"
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-gray-900/50 border border-gray-800/50 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 transition-colors"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-800 rounded">
        /
      </kbd>
    </div>
  );
}
