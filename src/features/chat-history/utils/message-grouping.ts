import { format, isWithinInterval, subMinutes } from 'date-fns';
import type { ChatMessage, MessageGroup } from '../types';

export function groupMessagesByInterval(messages: ChatMessage[]): MessageGroup[] {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: ChatMessage[] = [];
  let currentTimestamp = new Date(messages[0].timestamp);

  messages.forEach((message) => {
    const messageTime = new Date(message.timestamp);
    
    // Group messages within 15 minutes of each other
    if (
      isWithinInterval(messageTime, {
        start: subMinutes(currentTimestamp, 15),
        end: currentTimestamp,
      })
    ) {
      currentGroup.push(message);
    } else {
      if (currentGroup.length) {
        groups.push({
          timestamp: format(currentTimestamp, 'PPp'),
          messages: [...currentGroup],
        });
      }
      currentGroup = [message];
      currentTimestamp = messageTime;
    }
  });

  // Add final group
  if (currentGroup.length) {
    groups.push({
      timestamp: format(currentTimestamp, 'PPp'),
      messages: currentGroup,
    });
  }

  return groups;
}