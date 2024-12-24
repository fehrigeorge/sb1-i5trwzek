import { ChevronUp } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function LoadMoreButton({ onClick, isLoading }: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-4 text-sm text-gray-400 hover:text-gray-300 disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ChevronUp className="w-4 h-4" />
      )}
      Load more messages
    </button>
  );
}
