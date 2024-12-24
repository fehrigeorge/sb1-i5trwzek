import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChatMessage, MessageGroup } from '@/types';
import { format, isWithinInterval, subMinutes } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupMessagesByInterval(messages: ChatMessage[]): MessageGroup[] {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: ChatMessage[] = [];
  let currentTimestamp = new Date(messages[0].timestamp);

  messages.forEach((message) => {
    const messageTime = new Date(message.timestamp);
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

  if (currentGroup.length) {
    groups.push({
      timestamp: format(currentTimestamp, 'PPp'),
      messages: currentGroup,
    });
  }

  return groups;
}