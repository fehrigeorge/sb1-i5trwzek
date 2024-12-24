import { useRef, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChatPreviews } from '@/hooks/use-chat-previews';
import { useFavorites } from '@/hooks/use-favorites';
import { ChatListSkeleton } from './chat-list-skeleton';
import { SearchBar } from './search-bar';
import { ChatPreviewItem } from './chat-preview-item';
import { useSearchFocus } from '@/hooks/use-search-focus';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export function ChatList() {
  const navigate = useNavigate();
  const { data: previews = [], isLoading: isLoadingPreviews } =
    useChatPreviews();
  const { data: favorites = [], isLoading: isLoadingFavorites } =
    useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { selectedIndex } = useSearchFocus();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  const filteredPreviews = previews.filter((p) => {
    if (showFavoritesOnly && !favorites.includes(p.id)) return false;
    if (!searchQuery.trim()) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastMessage?.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const rowVirtualizer = useVirtualizer({
    count: filteredPreviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  if (isLoadingPreviews || isLoadingFavorites) return <ChatListSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-2">
        <SearchBar onSearch={setSearchQuery} />
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`w-full px-3 py-1.5 text-sm rounded-md transition-colors ${
            showFavoritesOnly
              ? 'bg-blue-600/20 text-blue-400'
              : 'text-gray-400 hover:bg-gray-800/50'
          }`}
        >
          {showFavoritesOnly ? 'Show all chats' : 'Show favorites only'}
        </button>
      </div>

      {filteredPreviews.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
          {showFavoritesOnly
            ? 'No favorite conversations yet'
            : 'No conversations found'}
        </div>
      ) : (
        <div ref={parentRef} className="flex-1 overflow-auto">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <Suspense fallback={<ChatListSkeleton />}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const preview = filteredPreviews[virtualRow.index];
                if (!preview) return null;

                return (
                  <div
                    key={preview.id}
                    ref={
                      virtualRow.index === filteredPreviews.length - 1
                        ? targetRef
                        : undefined
                    }
                    className="absolute top-0 left-0 w-full"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ChatPreviewItem
                      preview={preview}
                      isFavorite={favorites.includes(preview.id)}
                      isSelected={virtualRow.index === selectedIndex}
                      onClick={() => navigate(`/chats/${preview.id}`)}
                    />
                  </div>
                );
              })}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
