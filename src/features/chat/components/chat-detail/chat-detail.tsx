import { useRef, useEffect } from 'react';
import { useMessages } from '../../hooks/use-messages';
import { useParticipant } from '../../hooks/use-participant';
import { MessageList } from './message-list';
import { ChatHeader } from './chat-header';
import { MessageInput } from './message-input';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/shared/helpers';

interface ChatDetailProps {
  participantId: string;
  className?: string;
}

export function ChatDetail({ participantId, className }: ChatDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { targetRef, isIntersecting } = useIntersectionObserver();
  
  const { 
    data: messages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage 
  } = useMessages(participantId);
  
  const { data: participant } = useParticipant(participantId);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!participant || !messages?.pages) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-gray-950",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      <ChatHeader
        participant={participant}
        className="flex-shrink-0"
      />

      <MessageList
        messages={messages.pages.flat()}
        loadMoreRef={targetRef}
        isLoadingMore={isFetchingNextPage}
        className="flex-1"
      />

      <MessageInput 
        participantId={participantId}
        className="flex-shrink-0"
      />
    </div>
  );
}