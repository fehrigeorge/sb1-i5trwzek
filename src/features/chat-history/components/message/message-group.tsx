import { forwardRef } from 'react';
import { MessageBubble } from './message-bubble';
import { DateSeparator } from './date-separator';
import type { MessageGroup as MessageGroupType } from '../../types';

interface MessageGroupProps {
  group: MessageGroupType;
}

export const MessageGroup = forwardRef<HTMLDivElement, MessageGroupProps>(
  ({ group }, ref) => {
    const REMCO_ID = '77777777-7777-7777-7777-777777777777';

    return (
      <div ref={ref} className="p-4">
        <DateSeparator date={group.timestamp} />
        <div className="space-y-2">
          {group.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === REMCO_ID}
              showAvatar={
                index === 0 || 
                group.messages[index - 1]?.senderId !== message.senderId
              }
            />
          ))}
        </div>
      </div>
    );
  }
);

MessageGroup.displayName = 'MessageGroup';