import { memo } from 'react';
import { MessageGroup } from './message-group';
import { DateSeparator } from './date-separator';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { groupMessagesByDate } from '../../utils/message-grouping';
import type { Message } from '../../types';
import { cn } from '@/shared/helpers';

interface MessageListProps {
  messages: Message[];
  loadMoreRef?: (node?: Element | null) => void;
  isLoadingMore?: boolean;
  className?: string;
}

export const MessageList = memo(function MessageList({ 
  messages, 
  loadMoreRef,
  isLoadingMore,
  className 
}: MessageListProps) {
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div 
      className={cn(
        "overflow-y-auto px-4 py-6 space-y-6",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700",
        className
      )}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      <div ref={loadMoreRef} />

      {messageGroups.map((group) => (
        <div key={group.date} className="space-y-4">
          <DateSeparator date={group.date} />
          <MessageGroup messages={group.messages} />
        </div>
      ))}
    </div>
  );
});