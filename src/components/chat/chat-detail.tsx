import { useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { useParticipant } from '@/hooks/use-participant';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { MessageGroup } from './message/message-group';
import { DateSeparator } from './message/date-separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ChatHeader } from './chat-header';
import { ChatToolbar } from './toolbar/chat-toolbar';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useChatFilters } from '@/hooks/use-chat-filters';
import { useFavorites } from '@/hooks/use-favorites';

interface ChatDetailProps {
  participantId: string;
}

export function ChatDetail({ participantId }: ChatDetailProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver();
  const { data: participant } = useParticipant(participantId);
  const { data: favorites = [] } = useFavorites();
  const { showFavorites, sortOrder, dateRange } = useChatFilters();
  
  const { 
    data: messages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useMessages(participantId);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!participant || !messages?.pages) return null;

  // Flatten and filter messages
  let allMessages = messages.pages.flat();

  // Apply filters
  if (showFavorites) {
    allMessages = allMessages.filter(msg => favorites.includes(msg.id));
  }

  if (dateRange) {
    allMessages = allMessages.filter(msg => 
      isWithinInterval(new Date(msg.timestamp), {
        start: dateRange.from,
        end: dateRange.to
      })
    );
  }

  // Sort messages
  allMessages.sort((a, b) => {
    const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? diff : -diff;
  });

  // Group messages by date
  const messagesByDate = allMessages.reduce((groups, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof allMessages>);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <ChatHeader
        participantId={participant.id}
        participantName={participant.name}
        avatarUrl={participant.avatar_url}
      />
      
      <ChatToolbar />

      <div className="flex-1 overflow-y-auto">
        {Object.entries(messagesByDate).map(([date, dateMessages], index, array) => {
          const showDateSeparator = index === 0 || !isSameDay(
            new Date(date),
            new Date(array[index - 1][0])
          );

          return (
            <div key={date}>
              {showDateSeparator && <DateSeparator date={date} />}
              <MessageGroup messages={dateMessages} />
            </div>
          );
        })}
        
        {hasNextPage && (
          <div 
            ref={targetRef}
            className="py-4 flex items-center justify-center"
          >
            {isFetchingNextPage && <LoadingSpinner />}
          </div>
        )}
      </div>
    </div>
  );
}