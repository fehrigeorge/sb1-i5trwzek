import { MessageBubble } from './message-bubble';
import type { ChatMessage } from '@/types';

interface MessageGroupProps {
  messages: ChatMessage[];
  showAvatar?: boolean;
}

export function MessageGroup({ messages, showAvatar = true }: MessageGroupProps) {
  return (
    <>
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message.message}
          timestamp={message.timestamp}
          isRemco={message.senderId === '77777777-7777-7777-7777-777777777777'}
          showAvatar={showAvatar && (
            index === 0 || 
            messages[index - 1]?.senderId !== message.senderId
          )}
        />
      ))}
    </>
  );
}