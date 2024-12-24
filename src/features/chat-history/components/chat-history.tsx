import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChatMessages } from '../hooks/use-chat-messages';
import { useChatFilters } from '../hooks/use-chat-filters';
import { MessageGroup } from './message/message-group';
import { ChatToolbar } from './toolbar/chat-toolbar';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { groupMessagesByInterval } from '../utils/message-grouping';

interface ChatHistoryProps {
  participantId: string;
  className?: string;
}

export function ChatHistory({ participantId, className }: ChatHistoryProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { targetRef, isIntersecting } = useIntersectionObserver();
  const { showFavorites, sortOrder, dateRange } = useChatFilters();
  
  const { 
    data: messages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useChatMessages(participantId);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const messageGroups = groupMessagesByInterval(messages?.pages.flat() ?? []);

  return (
    <div className={className}>
      <ChatToolbar />
      
      <div ref={parentRef} className="h-full overflow-auto">
        {messageGroups.map((group) => (
          <MessageGroup
            key={group.timestamp}
            group={group}
            ref={targetRef}
          />
        ))}
        
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  );
}