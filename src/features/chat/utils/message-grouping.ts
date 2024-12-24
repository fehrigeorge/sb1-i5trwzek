```typescript
import { format, isSameDay } from 'date-fns';
import type { Message, MessageGroup } from '../types/message';

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages: messages.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }));
}

export function shouldShowAvatar(
  message: Message,
  messages: Message[],
  index: number
): boolean {
  if (index === 0) return true;
  const prevMessage = messages[index - 1];
  
  // Show avatar if sender changed or messages are not from same day
  return (
    message.senderId !== prevMessage.senderId ||
    !isSameDay(new Date(message.timestamp), new Date(prevMessage.timestamp))
  );
}
```