import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChatSettings } from '@/stores/chat-settings';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { MessageGroup } from './message-group';
import { LoadMoreButton } from './load-more-button';
import { groupMessagesByInterval } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
  hasNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  searchQuery?: string;
  highlightedMessageId?: string;
}

export function MessageList({
  messages,
  hasNextPage,
  isLoading,
  fetchNextPage,
  searchQuery,
  highlightedMessageId,
}: MessageListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { useInfiniteScroll, autoLoadOnInSight } = useChatSettings();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  const messageGroups = groupMessagesByInterval(messages);

  const rowVirtualizer = useVirtualizer({
    count: messageGroups.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    if (autoLoadOnInSight && isIntersecting && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [autoLoadOnInSight, isIntersecting, hasNextPage, isLoading, fetchNextPage]);

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const messageGroup = messageGroups[virtualRow.index];
          return (
            <div
              key={messageGroup.timestamp}
              ref={virtualRow.index === 0 ? targetRef : undefined}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MessageGroup
                group={messageGroup}
                searchQuery={searchQuery}
                highlightedMessageId={highlightedMessageId}
              />
            </div>
          );
        })}
      </div>

      {!autoLoadOnInSight && hasNextPage && (
        <LoadMoreButton
          onClick={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
